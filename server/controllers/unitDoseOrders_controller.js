const service = require("../services/unitDoseOrders_service");

async function getPatientByCodeUnitDose(req, res, next) {
  try {
    const { patientCode } = req.params;
    const data = await service.getPatientByCodeUnitDose(patientCode);

    if (!data) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}
async function getUnitDoseOrderByNo(req, res, next) {
  try {
    const { orderNo } = req.params;
    const data = await service.getOrderByNo(orderNo);

    if (!data) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}
async function getSectionsUnitDose(req, res, next) {
  try {
    const data = await service.getSectionsUnitDose();

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No Sections Found" });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function searchUnitDoseOrders(req, res, next) {
  try {
    let {
      patientCode = "",
      dateFrom = "",
      dateTo = "",
      doctorName = "",
      orderNo = "",
      sections = [],
      page = 1,
      pageSize = 10,
      sortBy = "",
      sortDirection = "desc",
    } = req.query;

    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;

    patientCode = String(patientCode).trim();
    doctorName = String(doctorName).trim();
    orderNo = String(orderNo).trim();

    if (!Array.isArray(sections)) {
      sections = sections ? [sections] : [];
    }

    sections = sections
      .map((section) => String(section).trim())
      .filter(Boolean);

    const hasAnyFilter =
      !!patientCode ||
      !!dateFrom ||
      !!dateTo ||
      !!doctorName ||
      !!orderNo ||
      sections.length > 0;
    sortBy = String(sortBy).trim();
    sortDirection = String(sortDirection).trim().toLowerCase();

    if (!["asc", "desc"].includes(sortDirection)) {
      sortDirection = "desc";
    }
    if (!hasAnyFilter) {
      return res.status(400).json({
        message: "Please enter at least one search filter.",
      });
    }

    if (!dateFrom && dateTo) {
      return res.status(400).json({
        message: "From Date is required when To Date is entered.",
      });
    }

    if (dateFrom && !dateTo) {
      dateTo = new Date().toISOString().split("T")[0];
    }

    const result = await service.searchUnitDoseOrders({
      patientCode,
      dateFrom,
      dateTo,
      doctorName,
      orderNo,
      sections,
      pageNumber: page,
      pageSize,
      sortBy,
      sortDirection,
    });

    const totalPages = Math.ceil(result.totalCount / pageSize);

    res.json({
      data: result.data,
      pagination: {
        page,
        pageSize,
        total: result.totalCount,
        totalPages,
        hasNext: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getUnitDoseOrderDetails(req, res, next) {
  try {
    const { orderNo } = req.params;
    const data = await service.getUnitDoseOrderDetails(orderNo);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function saveUnitDoseOrderItems(req, res, next) {
  try {
    const { orderNo } = req.params;
    const { selectedItems, userCode, password, notes } = req.body;

    if (!orderNo) {
      return res.status(400).json({ message: "Order number is required." });
    }

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({
        message: "Please select at least one item before saving.",
      });
    }

    if (!userCode || !password) {
      return res.status(400).json({
        message: "User code and password are required.",
      });
    }

    const result = await service.saveUnitDoseOrderItems({
      orderNo,
      selectedItems,
      userCode,
      password,
      notes,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function syncUnitDoseOrdersFromOracle(req, res, next) {
  try {
    const result = await service.syncUnitDoseOrdersFromOracle();
    res.json(result);
  } catch (error) {
    next(error);
  }
}
async function searchOrdersReport(req, res, next) {
  try {
    let {
      orderNo = "",
      patientCode = "",
      sections = [],
      doctorName = "",
      actionDateFrom = "",
      actionDateTo = "",
      medicationName = "",
      savedByCode = "",
      savedByName = "",
      recipientAtFrom = "",
      recipientAtTo = "",
      page = 1,
      pageSize = 10,
      sortBy = "",
      sortDirection = "desc",
    } = req.query;

    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;

    orderNo = String(orderNo).trim();
    patientCode = String(patientCode).trim();
    doctorName = String(doctorName).trim();
    medicationName = String(medicationName).trim();
    savedByCode = String(savedByCode).trim();
    savedByName = String(savedByName).trim();
    sortBy = String(sortBy).trim();
    sortDirection = String(sortDirection).trim().toLowerCase();

    if (!["asc", "desc"].includes(sortDirection)) {
      sortDirection = "desc";
    }

    if (!Array.isArray(sections)) {
      sections = sections ? [sections] : [];
    }

    sections = sections
      .map((section) => String(section).trim())
      .filter(Boolean);

    const hasAnyFilter =
      !!orderNo ||
      !!patientCode ||
      sections.length > 0 ||
      !!doctorName ||
      !!actionDateFrom ||
      !!actionDateTo ||
      !!medicationName ||
      !!savedByCode ||
      !!savedByName ||
      !!recipientAtFrom ||
      !!recipientAtTo;

    if (!hasAnyFilter) {
      return res.status(400).json({
        message: "Please enter at least one search filter.",
      });
    }

    if (!actionDateFrom && actionDateTo) {
      return res.status(400).json({
        message: "Action Date From is required when Action Date To is entered.",
      });
    }

    if (actionDateFrom && !actionDateTo) {
      actionDateTo = new Date().toISOString().split("T")[0];
    }

    if (!recipientAtFrom && recipientAtTo) {
      return res.status(400).json({
        message:
          "Recipient At From is required when Recipient At To is entered.",
      });
    }

    if (recipientAtFrom && !recipientAtTo) {
      recipientAtTo = new Date().toISOString().split("T")[0];
    }

    const result = await service.searchOrdersReport({
      orderNo,
      patientCode,
      sections,
      doctorName,
      actionDateFrom,
      actionDateTo,
      medicationName,
      savedByCode,
      savedByName,
      recipientAtFrom,
      recipientAtTo,
      pageNumber: page,
      pageSize,
      sortBy,
      sortDirection,
    });

    const totalPages = Math.ceil(result.totalCount / pageSize);

    res.json({
      data: result.data,
      pagination: {
        page,
        pageSize,
        total: result.totalCount,
        totalPages,
        hasNext: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getPatientByCodeUnitDose,
  getSectionsUnitDose,
  searchUnitDoseOrders,
  getUnitDoseOrderDetails,
  saveUnitDoseOrderItems,
  syncUnitDoseOrdersFromOracle,
  getUnitDoseOrderByNo,
  searchOrdersReport,
};
