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
    if (!hasPatientCode && !hasFromDate) {
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
async function getOrderByNo(req, res, next) {
  try {
    const { orderNo } = req.params;
    const data = await service.getOrderByNo(orderNo);

    if (!data) {
      return res.status(404).json({ message: "Order not found." });
    }

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
async function syncOrdersFromOracle(req, res, next) {
  try {
    const result = await service.syncOrdersFromOracle();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function searchOrdersReport(req, res, next) {
  try {
    let {
      patientCode = "",
      dateFrom = "",
      dateTo = "",
      sections = [],
      orderNo = "",
      medicationCode = "",
      actionDateFrom = "",
      actionDateTo = "",
      savedByCode = "",
      savedByName = "",
    } = req.query;

    patientCode = patientCode.trim();
    orderNo = orderNo.trim();
    medicationCode = medicationCode.trim();
    savedByCode = savedByCode.trim();
    savedByName = savedByName.trim();

    if (!Array.isArray(sections)) {
      sections = sections ? [sections] : [];
    }

    sections = sections
      .map((section) => String(section).trim())
      .filter(Boolean);

    const hasPatientCode = !!patientCode;
    const hasSections = sections.length > 0;
    const hasOrderNo = !!orderNo;
    const hasMedicationCode = !!medicationCode;
    const hasSavedByCode = !!savedByCode;
    const hasSavedByName = !!savedByName;
    const hasOrderDateFrom = !!dateFrom;
    const hasOrderDateTo = !!dateTo;
    const hasActionDateFrom = !!actionDateFrom;
    const hasActionDateTo = !!actionDateTo;

    const hasAnyFilter =
      hasPatientCode ||
      hasSections ||
      hasOrderNo ||
      hasMedicationCode ||
      hasSavedByCode ||
      hasSavedByName ||
      hasOrderDateFrom ||
      hasOrderDateTo ||
      hasActionDateFrom ||
      hasActionDateTo;

    if (!hasAnyFilter) {
      return res.status(400).json({
        message: "Please enter at least one search filter.",
      });
    }

    if (!hasOrderDateFrom && hasOrderDateTo) {
      return res.status(400).json({
        message: "Order Date From is required when Order Date To is entered.",
      });
    }

    if (!hasActionDateFrom && hasActionDateTo) {
      return res.status(400).json({
        message: "Action Date From is required when Action Date To is entered.",
      });
    }

    if (hasOrderDateFrom && !hasOrderDateTo) {
      dateTo = new Date().toISOString().split("T")[0];
    }

    if (hasActionDateFrom && !hasActionDateTo) {
      actionDateTo = new Date().toISOString().split("T")[0];
    }

    const hasNonDateFilters =
      hasPatientCode ||
      hasSections ||
      hasOrderNo ||
      hasMedicationCode ||
      hasSavedByCode ||
      hasSavedByName;

    function diffInDays(from, to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const msPerDay = 1000 * 60 * 60 * 24;
      return Math.floor((toDate - fromDate) / msPerDay);
    }

    if (
      !hasNonDateFilters &&
      hasOrderDateFrom &&
      dateTo &&
      diffInDays(dateFrom, dateTo) > 92
    ) {
      return res.status(400).json({
        message:
          "When searching by Order Date only, the range must not exceed 3 months.",
      });
    }

    if (
      !hasNonDateFilters &&
      hasActionDateFrom &&
      actionDateTo &&
      diffInDays(actionDateFrom, actionDateTo) > 92
    ) {
      return res.status(400).json({
        message:
          "When searching by Action Date only, the range must not exceed 3 months.",
      });
    }

    const data = await service.searchOrdersReport({
      patientCode,
      dateFrom,
      dateTo,
      sections,
      orderNo,
      medicationCode,
      actionDateFrom,
      actionDateTo,
      savedByCode,
      savedByName,
    });

    res.json(data);
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
  getOrderByNo,
  syncOrdersFromOracle,
  searchOrdersReport,
};
