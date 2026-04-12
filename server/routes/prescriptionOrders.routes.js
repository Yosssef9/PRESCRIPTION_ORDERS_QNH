const express = require("express");
const controller = require("../controllers/prescriptionOrders_controller");
const router = express.Router();
router.get("/patient-by-code/:patientCode", controller.getPatientByCode);
router.get("/orders", controller.searchOrders);
router.get("/sections", controller.getSections);
router.get("/orders/:orderNo/details", controller.getOrderDetails);
router.post("/orders/:orderNo/save", controller.saveOrderItems);
module.exports = router;
