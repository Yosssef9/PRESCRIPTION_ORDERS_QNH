const { sql, getPool } = require("../config/db");
const spVerifyRecipientUser = require("./shared/spVerifyRecipientUser");

// =========================
// Patient by code
// =========================
async function spGetPatientByCode(patientCode) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("PATIENT_CODE", sql.VarChar(50), patientCode)
    .execute("SP_GET_PH_PAT_CODE_Prescription_Unit_Dose");

  const row = result.recordset?.[0];
  if (!row) return null;

  return {
    patientCode: row.PATIENT_CODE || patientCode,
    patientName: row.PATIENT_NAME || row.PATIENT_NAME_EN || "",
  };
}

// =========================
// Sections
// =========================
async function spGetSections() {
  const pool = await getPool();

  const result = await pool
    .request()
    .execute("SP_GET_PH_SECTIONS_Prescription_Unit_Dose");

  return (result.recordset || []).map((row) => ({
    sectionName: row.SECTION_NAME || row.sectionName || "",
  }));
}

// =========================
// Orders table
// SP_Get_PH_PrescriptionOrders_Unit_Dose
// =========================
async function spSearchOrders({
  patientCode = null,
  dateFrom = null,
  dateTo = null,
  sections = [],
  doctorName = null,
  orderNo = null,
  pageNumber = 1,
  pageSize = 10,
  sortBy = null,
  sortDirection = "desc",
}) {
  const pool = await getPool();
  const request = pool.request();

  request.input("PATIENT_CODE", sql.NVarChar(50), patientCode || null);
  request.input(
    "SECTION_NAME",
    sql.NVarChar(sql.MAX),
    Array.isArray(sections) && sections.length > 0 ? sections.join(",") : null,
  );
  request.input("DATE_FROM", sql.Date, dateFrom ? new Date(dateFrom) : null);
  request.input("DATE_TO", sql.Date, dateTo ? new Date(dateTo) : null);
  request.input("DOCTOR_NAME", sql.NVarChar(200), doctorName || null);
  request.input("ORDER_NO", sql.NVarChar(50), orderNo || null);

  // 🆕 pagination
  request.input("PAGE_NUMBER", sql.Int, pageNumber);
  request.input("PAGE_SIZE", sql.Int, pageSize);
  request.input("SORT_BY", sql.NVarChar(50), sortBy || null);
  request.input("SORT_DIRECTION", sql.NVarChar(4), sortDirection || "desc");
  const result = await request.execute(
    "SP_Get_PH_PrescriptionOrders_Unit_Dose",
  );

  const data = (result.recordsets[0] || []).map((row) => ({
    orderNo: row.ORDER_NO || "",
    actionDate: row.ACTION_DATE || "",
    patientCode: row.PATIENT_CODE || "",
    patientName: row.PATIENT_NAME || "",
    sectionName: row.SECTION_NAME || "",
    doctor: row.DOCTOR_NAME || "",
  }));

  const totalCount = result.recordsets[1]?.[0]?.TotalCount || 0;

  return {
    data,
    totalCount,
  };
}

// =========================
// Quick search by order no
// =========================
async function spGetOrderByNo(orderNo) {
  const result = await spSearchOrders({
    patientCode: "",
    dateFrom: "",
    dateTo: "",
    sections: [],
    doctorName: "",
    orderNo,
    pageNumber: 1,
    pageSize: 1,
  });

  return result.data?.[0] || null;
}

// =========================
// Order details
// SP_Get_PH_PrescriptionOrders_Unit_Dose_Details
// =========================
async function spGetOrderDetails(orderNo) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("ORDER_NO", sql.VarChar(50), orderNo)
    .execute("SP_Get_PH_PrescriptionOrders_Unit_Dose_Details");

  return (result.recordset || []).map((row) => ({
    id: `${row.ORDER_NO}-${row.SEQUENCE_NO}`,
    sequenceNo: row.SEQUENCE_NO,
    orderNo: row.ORDER_NO,
    actionDate: row.ACTION_DATE || "",
    medicationName: row.MEDICATION_NAME || "",
    qty: row.QTY ?? "",
    unitName: row.UNIT_NAME || "",
    isDiscontinued: row.IS_DISCONTINUED ?? false,

    savedByUserCode: row.Recipient_code || null,
    savedByUserName: row.Recipient_name || null,
    savedAt: row.Recipient_at || null,
    notes: row.Notes || "",
  }));
}

// =========================
// Save recipient info
// SP_UPDATE_PH_PrescriptionOrderRecipient_Unit_Dose
// =========================
async function spSaveOrderItems({
  orderNo,
  selectedItems,
  userCode,
  password,
  notes,
}) {
  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    const error = new Error("Please select at least one item.");
    error.statusCode = 400;
    throw error;
  }

  const verifiedUser = await spVerifyRecipientUser(userCode, password);

  if (!verifiedUser) {
    const error = new Error("User code or password is incorrect.");
    error.statusCode = 401;
    throw error;
  }

  const details = await spGetOrderDetails(orderNo);

  if (!details.length) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  const selectedRows = details.filter((item) =>
    selectedItems.includes(item.id),
  );

  if (!selectedRows.length) {
    const error = new Error("No valid items selected.");
    error.statusCode = 400;
    throw error;
  }

  const alreadySavedItems = selectedRows.filter(
    (item) => item.savedByUserCode || item.savedAt,
  );

  if (alreadySavedItems.length > 0) {
    const error = new Error("Some items are already saved.");
    error.statusCode = 400;
    throw error;
  }

  const pool = await getPool();

  for (const row of selectedRows) {
    await pool
      .request()
      .input("SEQUENCE_NO", sql.Int, row.sequenceNo)
      .input("ORDER_NO", sql.VarChar(50), orderNo)
      .input("Recipient_code", sql.VarChar(50), verifiedUser.userCode)
      .input("Recipient_name", sql.VarChar(200), verifiedUser.userName)
      .input("Recipient_at", sql.DateTime, new Date())
      .input("Notes", sql.NVarChar(500), notes || null)
      .execute("SP_UPDATE_PH_PrescriptionOrderRecipient_Unit_Dose");
  }

  const refreshedDetails = await spGetOrderDetails(orderNo);

  return {
    success: true,
    orderNo,
    savedCount: selectedRows.length,
    message: `Saved ${selectedRows.length} item(s) successfully.`,
    details: refreshedDetails,
  };
}

// =========================
// Sync
// SP_Insert_PH_PrescriptionOrders_Unit_Dose
// =========================
async function spSyncOrdersFromOracle() {
  const pool = await getPool();

  const result = await pool
    .request()
    .execute("SP_Insert_PH_PrescriptionOrders_Unit_Dose");

  const row = result.recordset?.[0] || {};

  return {
    success: true,
    insertedCount:
      row.INSERTED_COUNT ?? row.InsertedCount ?? row.insertedCount ?? 0,
    skippedCount:
      row.SKIPPED_COUNT ?? row.SkippedCount ?? row.skippedCount ?? 0,
    message:
      row.MESSAGE || row.Message || "Unit Dose sync completed successfully.",
  };
}

// =========================
// Report
// SP_Search_PH_PrescriptionOrders_Unit_Dose
// =========================
async function spSearchOrdersReport({
  orderNo = null,
  patientCode = null,
  sections = [],
  doctorName = null,
  actionDateFrom = null,
  actionDateTo = null,
  medicationName = null,
  savedByCode = null,
  savedByName = null,
  recipientAtFrom = null,
  recipientAtTo = null,
  pageNumber = 1,
  pageSize = 10,
  sortBy = null,
  sortDirection = "desc",
}) {
  const pool = await getPool();
  const request = pool.request();

  request.input("ORDER_NO", sql.NVarChar(50), orderNo || null);
  request.input("PATIENT_CODE", sql.NVarChar(50), patientCode || null);

  request.input(
    "SECTION_NAME",
    sql.NVarChar(200),
    Array.isArray(sections) && sections.length > 0 ? sections.join(",") : null,
  );

  request.input("DOCTOR_NAME", sql.NVarChar(200), doctorName || null);

  request.input(
    "ACTION_DATE_FROM",
    sql.Date,
    actionDateFrom ? new Date(actionDateFrom) : null,
  );

  request.input(
    "ACTION_DATE_TO",
    sql.Date,
    actionDateTo ? new Date(actionDateTo) : null,
  );

  request.input("MEDICATION_NAME", sql.NVarChar(200), medicationName || null);
  request.input("Recipient_code", sql.NVarChar(50), savedByCode || null);
  request.input("Recipient_name", sql.NVarChar(200), savedByName || null);

  request.input(
    "RECIPIENT_AT_FROM",
    sql.Date,
    recipientAtFrom ? new Date(recipientAtFrom) : null,
  );

  request.input(
    "RECIPIENT_AT_TO",
    sql.Date,
    recipientAtTo ? new Date(recipientAtTo) : null,
  );

  request.input("PAGE_NUMBER", sql.Int, pageNumber);
  request.input("PAGE_SIZE", sql.Int, pageSize);
  request.input("SORT_BY", sql.NVarChar(50), sortBy || null);
  request.input("SORT_DIRECTION", sql.NVarChar(4), sortDirection || "desc");

  const result = await request.execute(
    "SP_Search_PH_PrescriptionOrders_Unit_Dose",
  );

  const data = (result.recordsets[0] || []).map((row) => ({
    orderNo: row.ORDER_NO || "",
    patientCode: row.PATIENT_CODE || "",
    patientName: row.PATIENT_NAME || "",
    actionDate: row.ACTION_DATE || "",
    doctor: row.DOCTOR_NAME || "",
    sectionName: row.SECTION_NAME || "",
    medicationName: row.MEDICATION_NAME || "",
    qty: row.QTY ?? "",
    unitName: row.UNIT_NAME || "",
    isDiscontinued: row.IS_DISCONTINUED ?? false,
    savedByCode: row.Recipient_code || "",
    savedByName: row.Recipient_name || "",
    savedAt: row.Recipient_at || "",
    notes: row.Notes || "",
  }));

  const totalCount = result.recordsets[1]?.[0]?.TotalCount || 0;

  return {
    data,
    totalCount,
  };
}
module.exports = {
  spGetPatientByCode,
  spGetSections,
  spSearchOrders,
  spGetOrderByNo,
  spGetOrderDetails,
  spSaveOrderItems,
  spSyncOrdersFromOracle,
  spSearchOrdersReport,
};
