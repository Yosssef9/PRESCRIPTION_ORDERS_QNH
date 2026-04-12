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
// async function spSearchOrders({
//   patientCode,
//   dateFrom,
//   dateTo,
//   sections = [],
// }) {
//   const mockOrders = [
//     {
//       orderNo: "ORD-1001",
//       orderDate: "2026-04-01",
//       doctor: "Dr. Khaled Al-Otaibi",
//       department: "Internal Medicine",
//       status: "Active",
//       itemsCount: 3,
//       patientCode: "P001",
//       sectionName: "Emergency",
//     },

//     {
//       orderNo: "ORD-1002",
//       orderDate: "2026-04-04",
//       doctor: "Dr. Ahmed Mansour",
//       department: "Emergency",
//       status: "Pending",
//       itemsCount: 11,
//       patientCode: "P001",
//       sectionName: "Emergency",
//     },
//     {
//       orderNo: "ORD-2001",
//       orderDate: "2026-03-29",
//       doctor: "Dr. Layla Samir",
//       department: "Obstetrics & Gynecology",
//       status: "On Hold",
//       itemsCount: 2,
//       patientCode: "P002",
//       sectionName: "Emergency",
//     },
//   ];

//   return mockOrders.filter((order) => {
//     if (patientCode && order.patientCode !== patientCode) return false;
//     if (dateFrom && order.orderDate < dateFrom) return false;
//     if (dateTo && order.orderDate > dateTo) return false;
//     if (sections.length > 0 && !sections.includes(order.sectionName))
//       return false;
//     return true;
//   });
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
// };

const { sql, getPool } = require("../config/db");

// =========================
// Patient by code
// SP_GET_PH_PAT_CODE_PrescriptionOrders
// @PATIENT_COD
// =========================
async function spGetPatientByCode(patientCode) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("PATIENT_COD", sql.VarChar(50), patientCode)
    .execute("SP_GET_PH_PAT_CODE_PrescriptionOrders");

  const row = result.recordset?.[0];

  if (!row) return null;

  return {
    patientCode: patientCode,
    patientName:
      row.patientName ||
      row.PATIENT_NAME ||
      row.PatientName ||
      row.PAT_NAME ||
      "",
  };
}

// =========================
// Sections
// SP_GET_PH_SECTIONS_PrescriptionOrders
// no params
// =========================
async function spGetSections() {
  const pool = await getPool();

  const result = await pool
    .request()
    .execute("SP_GET_PH_SECTIONS_PrescriptionOrders");

  return (result.recordset || []).map((row) => ({
    sectionName:
      row.sectionName ||
      row.SECTION_NAME ||
      row.SectionName ||
      row.SECTION_DESC ||
      "",
  }));
}

// =========================
// Orders
// SP_GET_PH_PrescriptionOrders
// @PATIENT_CODE
// @SECTION_NAME
// @ORDER_DATE_FROM
// @ORDER_DATE_TO
// =========================
async function spSearchOrders({
  patientCode,
  dateFrom,
  dateTo,
  sections = [],
}) {
  const pool = await getPool();

  // If multiple sections are selected, pass them as comma-separated string
  // unless your SP expects another format.
  const sectionNameParam = sections.length > 0 ? sections.join(",") : "";

  const result = await pool
    .request()
    .input("PATIENT_CODE", sql.VarChar(50), patientCode || "")
    .input("SECTION_NAME", sql.VarChar(sql.MAX), sectionNameParam)
    .input("ORDER_DATE_FROM", sql.VarChar(20), dateFrom || "")
    .input("ORDER_DATE_TO", sql.VarChar(20), dateTo || "")
    .execute("SP_GET_PH_PrescriptionOrders");

  return (result.recordset || []).map((row) => ({
    orderNo: row.orderNo || row.ORDER_NO || row.OrderNo || "",
    orderDate: row.orderDate || row.ORDER_DATE || row.OrderDate || "",
    doctor: row.doctor || row.DOCTOR_NAME || row.Doctor || "",
    department: row.department || row.DEPARTMENT || row.DEPARTMENT_NAME || "",
    status: row.status || row.STATUS || "",
    itemsCount:
      row.itemsCount ||
      row.ITEMS_COUNT ||
      row.ITEM_COUNT ||
      row.COUNT_ITEMS ||
      0,
    patientCode: row.patientCode || row.PATIENT_CODE || "",
    sectionName: row.sectionName || row.SECTION_NAME || "",
  }));
}

// =========================
// Still mock for now
// Replace later when you have SP
// =========================
const mockDetails = {
  "ORD-1001": [
    {
      id: "ORD-1001-1",
      itemCode: "MED-001",
      itemName: "Paracetamol 500 mg",
      dose: "1 Tablet",
      frequency: "Every 8 Hours",
      duration: "5 Days",
      quantity: 15,
      notes: "After meals",
      savedByUserCode: null,
      savedByUserName: null,
      savedAt: null,
    },
  ],
};

async function spGetOrderDetails(orderNo) {
  return mockDetails[orderNo] || [];
}

async function spSaveOrderItems({
  orderNo,
  selectedItems,
  userCode,
  password,
} = {}) {
  if (userCode !== "admin" || password !== "1234") {
    const error = new Error("User code or password is incorrect.");
    error.statusCode = 401;
    throw error;
  }

  const userNameMap = {
    admin: "System Administrator",
    doctor1: "Dr. Ahmed Hassan",
    nurse1: "Nurse Mona Ali",
  };

  const orderDetails = mockDetails[orderNo];

  if (!orderDetails) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    const error = new Error("Please select at least one item.");
    error.statusCode = 400;
    throw error;
  }

  const selectedRows = orderDetails.filter((item) =>
    selectedItems.includes(item.itemCode),
  );

  if (selectedRows.length === 0) {
    const error = new Error("No valid items selected.");
    error.statusCode = 400;
    throw error;
  }

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

  const now = new Date().toISOString();

  selectedRows.forEach((item) => {
    item.savedByUserCode = userCode;
    item.savedByUserName = userNameMap[userCode] || userCode;
    item.savedAt = now;
  });

  return {
    success: true,
    orderNo,
    savedCount: selectedRows.length,
    message: `Saved ${selectedRows.length} item(s) successfully.`,
    details: orderDetails,
  };
}

module.exports = {
  spGetPatientByCode,
  spSearchOrders,
  spGetOrderDetails,
  spSaveOrderItems,
  spGetSections,
};
