const express = require("express");
const controller = require("../controllers/unitDoseOrders_controller");

const router = express.Router();

// =========================
// Patient by code
// =========================
router.get("/patient/:patientCode", controller.getPatientByCodeUnitDose);

// =========================
// Sections
// =========================
router.get("/sections", controller.getSectionsUnitDose);
// =========================
// report
// =========================
router.get("/report", controller.searchOrdersReport);
// =========================
// Search orders (master table)
// =========================
router.get("/", controller.searchUnitDoseOrders);

// =========================
// Get order by order number
// =========================
router.get("/:orderNo", controller.getUnitDoseOrderByNo);
// =========================
// Get order details
// =========================
router.get("/:orderNo/details", controller.getUnitDoseOrderDetails);

// =========================
// Save selected items + notes
// =========================
router.post("/:orderNo/save", controller.saveUnitDoseOrderItems);

// =========================
// Sync from Oracle
// =========================
router.post("/sync", controller.syncUnitDoseOrdersFromOracle);

module.exports = router;
