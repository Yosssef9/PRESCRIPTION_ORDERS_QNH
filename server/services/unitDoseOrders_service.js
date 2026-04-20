const db = require("../repositories/unitDoseOrders_repositorie");

async function getPatientByCodeUnitDose(patientCode) {
  if (!patientCode) return null;
  return db.spGetPatientByCode(patientCode);
}

async function searchUnitDoseOrders(filters) {
  return db.spSearchOrders(filters);
}

async function getOrderByNo(orderNo) {
  return db.spGetOrderByNo(orderNo);
}

async function getUnitDoseOrderDetails(orderNo) {
  return db.spGetOrderDetails(orderNo);
}

async function saveUnitDoseOrderItems(payload) {
  return db.spSaveOrderItems(payload);
}

async function getSectionsUnitDose() {
  return db.spGetSections();
}

async function syncUnitDoseOrdersFromOracle() {
  return db.spSyncOrdersFromOracle();
}

async function searchOrdersReport(filters) {
  return db.spSearchOrdersReport(filters);
}

module.exports = {
  getPatientByCodeUnitDose,
  searchUnitDoseOrders,
  getOrderByNo,
  getUnitDoseOrderDetails,
  saveUnitDoseOrderItems,
  getSectionsUnitDose,
  syncUnitDoseOrdersFromOracle,
  searchOrdersReport,
};
