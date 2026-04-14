const db = require("../repositories/prescriptionOrders_repositorie");
async function getPatientByCode(patientCode) {
  if (!patientCode) return null;
  return db.spGetPatientByCode(patientCode);
}
async function searchOrders(filters) {
  return db.spSearchOrders(filters);
}

async function getOrderByNo(orderNo) {
  return db.spGetOrderByNo(orderNo);
}
async function getOrderDetails(orderNo) {
  return db.spGetOrderDetails(orderNo);
}
async function saveOrderItems(payload) {
  return db.spSaveOrderItems(payload);
}
async function getSections() {
  return db.spGetSections();
}
async function syncOrdersFromOracle() {
  return db.spSyncOrdersFromOracle();
}
module.exports = {
  getPatientByCode,
  searchOrders,
  getOrderDetails,
  saveOrderItems,
  getSections,
  getOrderByNo,
  syncOrdersFromOracle
};
