// // This file is only placeholders for your future stored procedures.
// // Replace each function body later with your real SQL Server stored
// async function spGetPatientByCode(patientCode) {
//   // Example placeholder result
//   const mockPatients = {
//     P001: { patientCode: "P001", patientName: "Ahmed Mohamed Ali" },
//     P002: { patientCode: "P002", patientName: "Sara Khaled Hassan" },
//     P003: { patientCode: "P003", patientName: "Mohamed Yasser Ibrahim" },
//   };
//   return mockPatients[patientCode] || null;
// }
// async function spGetSections() {
//   // Example placeholder result
//   const mockSections = [
//     { sectionName: "Emergency" },
//     { sectionName: "ICU" },
//     { sectionName: "Outpatient" },
//     { sectionName: "Pediatrics" },
//     { sectionName: "Internal Medicine" },
//     { sectionName: "Surgery" },
//   ];
//   return mockSections || null;
// }
// const mockOrders = [
//   {
//     orderNo: "ORD-1001",
//     orderDate: "2026-04-01",
//     doctor: "Dr. Khaled Al-Otaibi",
//     department: "Internal Medicine",
//     status: "Active",
//     itemsCount: 3,
//     patientCode: "P001",
//     sectionName: "Emergency",
//   },
//   {
//     orderNo: "ORD-1002",
//     orderDate: "2026-04-04",
//     doctor: "Dr. Ahmed Mansour",
//     department: "Emergency",
//     status: "Pending",
//     itemsCount: 11,
//     patientCode: "P001",
//     sectionName: "Emergency",
//   },
//   {
//     orderNo: "ORD-2001",
//     orderDate: "2026-03-29",
//     doctor: "Dr. Layla Samir",
//     department: "Obstetrics & Gynecology",
//     status: "On Hold",
//     itemsCount: 2,
//     patientCode: "P002",
//     sectionName: "Emergency",
//   },
// ];

// async function spSearchOrders({
//   patientCode,
//   dateFrom,
//   dateTo,
//   sections = [],
// }) {
//   return mockOrders.filter((order) => {
//     if (patientCode && order.patientCode !== patientCode) return false;
//     if (dateFrom && order.orderDate < dateFrom) return false;
//     if (dateTo && order.orderDate > dateTo) return false;
//     if (sections.length > 0 && !sections.includes(order.sectionName))
//       return false;
//     return true;
//   });
// }

// async function spGetOrderByNo(orderNo) {
//   if (!orderNo) return null;

//   return (
//     mockOrders.find(
//       (order) => order.orderNo.toLowerCase() === String(orderNo).toLowerCase(),
//     ) || null
//   );
// }
// const mockDetails = {
//   "ORD-1001": [
//     {
//       id: "ORD-1001-1",
//       itemCode: "MED-001",
//       itemName: "Paracetamol 500 mg",
//       dose: "1 Tablet",
//       frequency: "Every 8 Hours",
//       duration: "5 Days",
//       quantity: 15,
//       notes: "After meals",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1001-2",
//       itemCode: "MED-002",
//       itemName: "Amoxicillin 625 mg",
//       dose: "1 Tablet",
//       frequency: "Every 12 Hours",
//       duration: "7 Days",
//       quantity: 14,
//       notes: "None",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//   ],

//   "ORD-1002": [
//     {
//       id: "ORD-1002-1",
//       itemCode: "MED-010",
//       itemName: "Normal Saline",
//       dose: "500 ml",
//       frequency: "Once",
//       duration: "1 Day",
//       quantity: 1,
//       notes: "IV",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-2",
//       itemCode: "MED-011",
//       itemName: "Glucose 5%",
//       dose: "500 ml",
//       frequency: "Once",
//       duration: "1 Day",
//       quantity: 1,
//       notes: "IV",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-3",
//       itemCode: "MED-012",
//       itemName: "Ceftriaxone 1g",
//       dose: "1 Vial",
//       frequency: "Every 24 Hours",
//       duration: "5 Days",
//       quantity: 5,
//       notes: "IM",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-4",
//       itemCode: "MED-013",
//       itemName: "Ibuprofen 400 mg",
//       dose: "1 Tablet",
//       frequency: "Every 8 Hours",
//       duration: "3 Days",
//       quantity: 9,
//       notes: "After meals",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-5",
//       itemCode: "MED-014",
//       itemName: "Omeprazole 20 mg",
//       dose: "1 Capsule",
//       frequency: "Once Daily",
//       duration: "7 Days",
//       quantity: 7,
//       notes: "Before breakfast",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-6",
//       itemCode: "MED-015",
//       itemName: "Metformin 500 mg",
//       dose: "1 Tablet",
//       frequency: "Twice Daily",
//       duration: "30 Days",
//       quantity: 60,
//       notes: "After meals",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-7",
//       itemCode: "MED-016",
//       itemName: "Aspirin 81 mg",
//       dose: "1 Tablet",
//       frequency: "Once Daily",
//       duration: "30 Days",
//       quantity: 30,
//       notes: "Morning",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-8",
//       itemCode: "MED-017",
//       itemName: "Vitamin D 1000 IU",
//       dose: "1 Tablet",
//       frequency: "Once Daily",
//       duration: "60 Days",
//       quantity: 60,
//       notes: "After meals",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-9",
//       itemCode: "MED-018",
//       itemName: "Insulin",
//       dose: "10 Units",
//       frequency: "Before meals",
//       duration: "Ongoing",
//       quantity: 1,
//       notes: "Subcutaneous",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//     {
//       id: "ORD-1002-10",
//       itemCode: "MED-019",
//       itemName: "Lisinopril 10 mg",
//       dose: "1 Tablet",
//       frequency: "Once Daily",
//       duration: "30 Days",
//       quantity: 30,
//       notes: "Morning",
//       savedByUserCode: null,
//       savedByUserName: null,
//       savedAt: null,
//     },
//   ],
// };

// async function spGetOrderDetails(orderNo) {
//   return mockDetails[orderNo] || [];
// }
// async function spSaveOrderItems({
//   orderNo,
//   selectedItems,
//   userCode,
//   password,
// }) {
//   if (userCode !== "admin" || password !== "1234") {
//     const error = new Error("User code or password is incorrect.");
//     error.statusCode = 401;
//     throw error;
//   }

//   const userNameMap = {
//     admin: "System Administrator",
//     doctor1: "Dr. Ahmed Hassan",
//     nurse1: "Nurse Mona Ali",
//   };

//   const orderDetails = mockDetails[orderNo];

//   if (!orderDetails) {
//     const error = new Error("Order not found.");
//     error.statusCode = 404;
//     throw error;
//   }

//   if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
//     const error = new Error("Please select at least one item.");
//     error.statusCode = 400;
//     throw error;
//   }

//   const selectedRows = orderDetails.filter((item) =>
//     selectedItems.includes(item.itemCode),
//   );

//   if (selectedRows.length === 0) {
//     const error = new Error("No valid items selected.");
//     error.statusCode = 400;
//     throw error;
//   }

//   const alreadySavedItems = selectedRows.filter(
//     (item) => item.savedByUserCode || item.savedAt,
//   );

//   if (alreadySavedItems.length > 0) {
//     const error = new Error(
//       `These item(s) are already saved and cannot be saved again: ${alreadySavedItems
//         .map((item) => item.itemCode)
//         .join(", ")}`,
//     );
//     error.statusCode = 400;
//     throw error;
//   }

//   const now = new Date().toISOString();

//   selectedRows.forEach((item) => {
//     item.savedByUserCode = userCode;
//     item.savedByUserName = userNameMap[userCode] || userCode;
//     item.savedAt = now;
//   });

//   return {
//     success: true,
//     orderNo,
//     savedCount: selectedRows.length,
//     message: `Saved ${selectedRows.length} item(s) successfully.`,
//     details: orderDetails,
//   };
// }

// module.exports = {
//   spGetPatientByCode,
//   spSearchOrders,
//   spGetOrderDetails,
//   spSaveOrderItems,
//   spGetSections,
//   spGetOrderByNo,
// };

const { sql, getPool } = require("../config/db");

// =========================
// Patient by code
// SP_GET_PH_PAT_CODE_PrescriptionOrders
// =========================
async function spGetPatientByCode(patientCode) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("PATIENT_CODE", sql.VarChar(50), patientCode)
    .execute("SP_GET_PH_PAT_CODE_PrescriptionOrders");

  const row = result.recordset?.[0];
  if (!row) return null;

  return {
    patientCode: row.PATIENT_CODE || patientCode,
    patientName: row.PATIENT_NAME || row.PATIENT_NAME_EN || "",
  };
}

// =========================
// Sections
// SP_GET_PH_SECTIONS_PrescriptionOrders
// =========================
async function spGetSections() {
  const pool = await getPool();

  const result = await pool
    .request()
    .execute("SP_GET_PH_SECTIONS_PrescriptionOrders");

  return (result.recordset || []).map((row) => ({
    sectionName: row.SECTION_NAME || row.sectionName || "",
  }));
}

// =========================
// Orders table
// SP_GET_PH_PrescriptionOrders
// =========================
async function spSearchOrders({
  patientCode = null,
  dateFrom = null,
  dateTo = null,
  sections = [],
  orderNo = null,
}) {
  const pool = await getPool();

  const sectionNameParam =
    Array.isArray(sections) && sections.length > 0 ? sections[0] : null;

  const request = pool.request();

  request.input("PATIENT_CODE", sql.VarChar(50), patientCode || null);
  request.input("SECTION_NAME", sql.VarChar(200), sectionNameParam || null);
  request.input(
    "ORDER_DATE_FROM",
    sql.DateTime,
    dateFrom ? new Date(dateFrom) : null,
  );
  request.input(
    "ORDER_DATE_TO",
    sql.DateTime,
    dateTo ? new Date(dateTo) : null,
  );
  request.input("Order_No", sql.VarChar(50), orderNo || null);

  const result = await request.execute("SP_GET_PH_PrescriptionOrders");

  return (result.recordset || []).map((row) => ({
    orderNo: row.ORDER_NO || "",
    orderDate: row.ORDER_DATE || "",
    patientCode: row.PATIENT_CODE || "",
    patientName: row.PATIENT_NAME || "",
    sectionName: row.SECTION_NAME || "",
    doctor: row.DOCTOR_NAME || "",
  }));
}

// =========================
// Quick search by order no
// reuses SP_GET_PH_PrescriptionOrders
// =========================
async function spGetOrderByNo(orderNo) {
  const rows = await spSearchOrders({
    patientCode: "",
    dateFrom: "",
    dateTo: "",
    sections: [],
    orderNo,
  });

  return rows[0] || null;
}

// =========================
// Order details
// SP_GET_PH_PrescriptionOrderDetails
// =========================
async function spGetOrderDetails(orderNo) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("ORDER_NO", sql.VarChar(50), orderNo)
    .execute("SP_GET_PH_PrescriptionOrderDetails");

  return (result.recordset || []).map((row) => ({
    id: `${row.ORDER_NO}-${row.SEQUENCE_NO}`,
    sequenceNo: row.SEQUENCE_NO,
    orderNo: row.ORDER_NO,
    orderDate: row.ORDER_DATE,
    medicationCode: row.MEDICATION_CODE,
    medicationName: row.MEDICATION_NAME,
    actionDate: row.PRESCRIPTION_ACTION_DATE || "-",
    endDate: row.PRESCRIPTION_END_DATE || "-",

    savedByUserCode: row.Recipient_code || null,
    savedByUserName: row.Recipient_name || null,
    savedAt: row.Recipient_at || null,
  }));
}

// =========================
// Save recipient info
// SP_UPDATE_PH_PrescriptionOrderRecipient
// =========================
async function spSaveOrderItems({
  orderNo,
  selectedItems,
  userCode,
  password,
}) {
  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    const error = new Error("Please select at least one item.");
    error.statusCode = 400;
    throw error;
  }

  // 1) Verify user first
  const verifiedUser = await spVerifyRecipientUser(userCode, password);

  if (!verifiedUser) {
    const error = new Error("User code or password is incorrect.");
    error.statusCode = 401;
    throw error;
  }

  // 2) Load order details
  const details = await spGetOrderDetails(orderNo);

  if (!details.length) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  // 3) Find selected rows
  const selectedRows = details.filter(
    (item) =>
      selectedItems.includes(item.id) || selectedItems.includes(item.itemCode),
  );

  if (!selectedRows.length) {
    const error = new Error("No valid items selected.");
    error.statusCode = 400;
    throw error;
  }

  // 4) Prevent re-saving rows already received
  const alreadySavedItems = selectedRows.filter(
    (item) => item.savedByUserCode || item.savedAt,
  );

  if (alreadySavedItems.length > 0) {
    const error = new Error(
      `These item(s) are already saved and cannot be saved again: ${alreadySavedItems
        .map((item) => item.itemCode)
        .join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  // 5) Update each selected row
  const pool = await getPool();

  for (const row of selectedRows) {
    await pool
      .request()
      .input("SEQUENCE_NO", sql.Int, row.sequenceNo)
      .input("ORDER_NO", sql.VarChar(50), orderNo)
      .input("Recipient_code", sql.VarChar(50), verifiedUser.userCode)
      .input("Recipient_name", sql.VarChar(100), verifiedUser.userName)
      .input("Recipient_at", sql.DateTime, new Date())
      .execute("SP_UPDATE_PH_PrescriptionOrderRecipient");
  }

  // 6) Reload fresh details
  const refreshedDetails = await spGetOrderDetails(orderNo);

  return {
    success: true,
    orderNo,
    savedCount: selectedRows.length,
    message: `Saved ${selectedRows.length} item(s) successfully.`,
    details: refreshedDetails,
  };
}
async function spVerifyRecipientUser(userCode, password) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("USER_CODE", sql.VarChar(50), userCode)
    .input("USER_PASSWORD", sql.VarChar(100), password)
    .execute("SP_CHECK_PH_USER_PW");

  const row = result.recordset?.[0];

  if (!row) return null;

  const isValid =
    row.IS_VALID === 1 ||
    row.IS_VALID === true ||
    row.IsValid === 1 ||
    row.IsValid === true;

  if (!isValid) return null;

  return {
    userCode: row.USER_CODE || userCode,
    userName: row.USER_NAME || row.USER_FULL_NAME || userCode,
  };
}
async function spSyncOrdersFromOracle() {
  const pool = await getPool();

  const result = await pool
    .request()
    .execute("SP_Insert_PH_PrescriptionOrders");

  const row = result.recordset?.[0] || {};

  return {
    success: true,
    insertedCount:
      row.INSERTED_COUNT ?? row.InsertedCount ?? row.insertedCount ?? 0,
    skippedCount:
      row.SKIPPED_COUNT ?? row.SkippedCount ?? row.skippedCount ?? 0,
    message:
      row.MESSAGE || row.Message || "Orders sync completed successfully.",
  };
}

async function spSearchOrdersReport({
  patientCode = null,
  dateFrom = null,
  dateTo = null,
  sections = [],
  orderNo = null,
  medicationCode = null,
  actionDateFrom = null,
  actionDateTo = null,
  savedByCode = null,
  savedByName = null,
}) {
  const pool = await getPool();
  const request = pool.request();

  request.input("ORDER_NO", sql.NVarChar(50), orderNo || null);
  request.input("PATIENT_CODE", sql.NVarChar(50), patientCode || null);

  request.input(
    "SECTION_NAME",
    sql.NVarChar(sql.MAX),
    Array.isArray(sections) && sections.length > 0 ? sections.join(",") : null,
  );

  request.input("MEDICATION_CODE", sql.NVarChar(50), medicationCode || null);

  request.input(
    "ORDER_DATE_FROM",
    sql.Date,
    dateFrom ? new Date(dateFrom) : null,
  );

  request.input(
    "ORDER_DATE_TO",
    sql.Date,
    dateTo ? new Date(dateTo) : null,
  );

  request.input(
    "PRESCRIPTION_ACTION_FROM",
    sql.Date,
    actionDateFrom ? new Date(actionDateFrom) : null,
  );

  request.input(
    "PRESCRIPTION_ACTION_TO",
    sql.Date,
    actionDateTo ? new Date(actionDateTo) : null,
  );

  request.input("SAVED_BY_CODE", sql.NVarChar(50), savedByCode || null);
  request.input("SAVED_BY_NAME", sql.NVarChar(200), savedByName || null);

  const result = await request.execute("SP_SEARCH_PH_PrescriptionOrders_Result");

  return (result.recordset || []).map((row) => ({
    orderNo: row.ORDER_NO || "",
    orderDate: row.ORDER_DATE || "",
    doctor: row.DOCTOR_NAME || "",
    sectionName: row.SECTION_NAME || "",
    patientCode: row.PATIENT_CODE || "",
    patientName: row.PATIENT_NAME || "",
    medicationCode: row.MEDICATION_CODE || "",
    medicationName: row.MEDICATION_NAME || "",
    actionDate: row.PRESCRIPTION_ACTION_DATE || "",
    endDate: row.PRESCRIPTION_END_DATE || "",
    savedByCode: row.Recipient_code || "",
    savedByName: row.Recipient_name || "",
    savedAt: row.Recipient_at || "",
  }));
}


module.exports = {
  spGetPatientByCode,
  spGetSections,
  spSearchOrders,
  spGetOrderByNo,
  spGetOrderDetails,
  spSaveOrderItems,
  spSyncOrdersFromOracle,
  spSearchOrdersReport
};
