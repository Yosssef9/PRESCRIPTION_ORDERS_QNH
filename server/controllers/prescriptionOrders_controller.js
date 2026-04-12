const service = require("../services/prescriptionOrders_service");
async function getPatientByCode(req, res, next) {
  try {
    const { patientCode } = req.params;
    const data = await service.getPatientByCode(patientCode);
    if (!data) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
}
async function getSections(req, res, next) {
  try {
    const data = await service.getSections();
    if (!data) {
      return res.status(404).json({ message: "No Sections Found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
}
async function searchOrders(req, res, next) {
  try {
    let {
      patientCode = "",
      dateFrom = "",
      dateTo = "",
      sections = [],
    } = req.query;
    console.log(" req.query", req.query);
    console.log(" req.query sections", sections);
    patientCode = patientCode.trim();

    // Make sure sections is always an array
    if (!Array.isArray(sections)) {
      sections = sections ? [sections] : [];
    }

    sections = sections
      .map((section) => String(section).trim())
      .filter(Boolean);

    const hasPatientCode = !!patientCode;
    const hasFromDate = !!dateFrom;
    const hasToDate = !!dateTo;
    const hasSections = sections.length > 0;

    // 1) Validation:
    // Patient Code OR (From Date + at least one Section)
    if (!hasPatientCode && !(hasFromDate && hasSections)) {
      return res.status(400).json({
        message:
          "Please enter Patient Code, or choose From Date with at least one Section before searching.",
      });
    }

    // 2) Prevent end date only
    if (!hasFromDate && hasToDate) {
      return res.status(400).json({
        message: "From Date is required when To Date is entered.",
      });
    }

    // 3) If start only, set end = today
    if (hasFromDate && !hasToDate) {
      dateTo = new Date().toISOString().split("T")[0];
    }

    const data = await service.searchOrders({
      patientCode,
      dateFrom,
      dateTo,
      sections,
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
}
async function getOrderDetails(req, res, next) {
  try {
    const { orderNo } = req.params;
    const data = await service.getOrderDetails(orderNo);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
async function saveOrderItems(req, res, next) {
  try {
    const { orderNo } = req.params;
    const { selectedItems, userCode, password } = req.body;
    const result = await service.saveOrderItems({
      orderNo,
      selectedItems,
      userCode,
      password,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getPatientByCode,
  searchOrders,
  getOrderDetails,
  getSections,
  saveOrderItems,
};
