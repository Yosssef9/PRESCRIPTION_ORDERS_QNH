import { useMemo, useState, useEffect, useRef } from "react";

import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  getPatientByCode,
  getOrderDetails,
  saveOrderItems,
  searchOrders,
  getSections,
  getOrderByNo,
  syncOrdersFromOracle,
} from "../api/prescriptionOrdersApi";
import TableSpinner from "../components/TableSpinner";
import TableEmptyState from "../components/TableEmptyState";
import toast from "react-hot-toast";
import { formatDate } from "../helpers/formatDate";
import { Filter, BarChart } from "lucide-react";
import SearchableMultiSelect from "../components/SearchableMultiSelect";
import TablePagination from "../components/TablePagination";
import getTodayDateString from "../helpers/getTodayDateString";
import { useAuth } from "../auth/AuthContext";

import { useNavigate } from "react-router-dom";
import compareValues from "../helpers/compareValues";
import renderSortArrow from "../helpers/renderSortArrow";
import UserAvatar from "../components/UserAvatar";
const statusClassMap = {
  Active: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  "On Hold": "bg-rose-50 text-rose-700",
};
function MessageBox({ message }) {
  if (!message.text) return null;

  return (
    <div
      className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
        message.type === "success"
          ? "border-[#c7e5cb] bg-[#ebf6ec] text-emerald-700"
          : "border-[#f4c5cd] bg-[#fdecef] text-rose-700"
      }`}
    >
      {message.text}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#d7ccc8] bg-gradient-to-b from-white to-[#fcf8f6] p-4 shadow-[0_8px_20px_rgba(78,52,46,0.06)]">
      <span className="mb-1 block text-xs text-[#795548]">{label}</span>
      <strong className="text-2xl text-[#4e342e]">{value}</strong>
    </div>
  );
}
function SaveModal({
  open,
  onClose,
  onConfirm,
  loading,
  selectedCount = 0,
  defaultNotes = "",
}) {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState(defaultNotes);
  const [error, setError] = useState("");
  const userCodeRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUserCode("");
      setPassword("");
      setNotes(defaultNotes || "");
      setError("");
    }
  }, [open, defaultNotes]);

  useEffect(() => {
    if (open) {
      setTimeout(() => userCodeRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEsc(e) {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, loading, onClose]);

  const isSubmitDisabled = loading || !userCode.trim() || !password.trim();

  async function handleConfirm() {
    if (isSubmitDisabled) return;

    setError("");
    const result = await onConfirm({
      userCode: userCode.trim(),
      password: password.trim(),
      notes: notes.trim(),
    });

    if (!result.success) {
      setError(result.message || "Save failed");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(40,22,17,0.45)] p-4"
          onClick={() => {
            if (!loading) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-full max-w-[520px] overflow-hidden rounded-[22px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-[#5d4037] to-[#795548] px-5 py-[18px] text-white">
              <h3 className="text-xl font-bold">Confirm Save</h3>
              <p className="mt-1.5 text-sm text-white/85">
                Enter user code and password before saving
              </p>
              <p className="mt-1 text-xs text-white/75">
                You are about to save {selectedCount} item
                {selectedCount !== 1 && "s"}.
              </p>
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#6d4c41]">
                  User Code
                </label>
                <input
                  ref={userCodeRef}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirm();
                  }}
                  className="h-[46px] rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3.5 text-sm outline-none focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <label className="text-sm font-bold text-[#6d4c41]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirm();
                  }}
                  className="h-[46px] rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3.5 text-sm outline-none focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <label className="text-sm font-bold text-[#6d4c41]">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Enter optional note..."
                  className="rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3.5 py-3 text-sm outline-none focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30"
                />
              </div>

              {error && (
                <motion.div
                  className="mt-4 rounded-xl border border-[#f4c5cd] bg-[#fdecef] px-4 py-3 text-sm font-semibold text-rose-700"
                  role="alert"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="mt-[18px] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="h-[46px] rounded-xl border border-[#d7ccc8] bg-[#efebe9] px-[18px] text-sm font-bold text-[#5d4037] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitDisabled}
                  className="h-[46px] rounded-xl bg-gradient-to-br from-[#5d4037] to-[#795548] px-[18px] text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Confirm"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default function PrescriptionOrdersTab({ registerRefreshHandler }) {
  const [patientCode, setPatientCode] = useState("");
  const [patientName, setPatientName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState("");
  const [details, setDetails] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsFilter, setDetailsFilter] = useState("all");
  const [hasSearchedOrders, setHasSearchedOrders] = useState(false);
  const [hasLoadedDetails, setHasLoadedDetails] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [saveNotes, setSaveNotes] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
  });
  const [ordersSort, setOrdersSort] = useState({
    key: "",
    direction: "asc",
  });

  const [detailsSort, setDetailsSort] = useState({
    key: "",
    direction: "asc",
  });
  const { user, loading } = useAuth();
  useEffect(() => {
    registerRefreshHandler(runOrdersSync);
  }, []);
  function handleOrdersSort(columnKey) {
    const newDirection =
      ordersSort.key === columnKey && ordersSort.direction === "asc"
        ? "desc"
        : "asc";

    const newSort = {
      key: columnKey,
      direction: newDirection,
    };

    setOrdersSort(newSort);

    ordersMutation.mutate({
      patientCode: patientCode.trim(),
      dateFrom,
      dateTo,
      sections: selectedSections,
      page: 1,
      pageSize: pagination.pageSize,
      sortBy: newSort.key,
      sortDirection: newSort.direction,
    });

    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  function handleDetailsSort(columnKey) {
    setDetailsSort((prev) => {
      if (prev.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key: columnKey,
        direction: "asc",
      };
    });
  }
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;

    async function loadSections() {
      try {
        setSectionsLoading(true);
        const data = await getSections();
        console.log("useEffect getSections data", data);
        if (isMounted) {
          setSections(data || []);
        }
      } catch (error) {
        if (isMounted) {
          setSections([]);
          showMessage("Failed to load sections.", "error");
        }
      } finally {
        if (isMounted) {
          setSectionsLoading(false);
        }
      }
    }

    loadSections();

    return () => {
      isMounted = false;
    };
  }, []);
  function isItemAlreadySaved(item) {
    return !!item.savedByUserCode || !!item.savedAt;
  }
  function showMessage(text, type = "success") {
    setMessage({ text, type });
    if (!text) return; // ✅ ADD THIS
    toast.dismiss(); // remove old toasts

    if (type === "success") {
      // toast.success(text);
    } else {
      toast.error(text);
    }
  }
  function handleClearAll() {
    setPatientCode("");
    setPatientName("");
    setDateFrom("");
    setDateTo("");
    setOrderSearch("");
    setOrders([]);
    setSelectedOrderNo("");
    setDetails([]);
    setSelectedItems([]);
    setMessage({ text: "", type: "" });
    setIsModalOpen(false);
    setDetailsFilter("all");
    setHasSearchedOrders(false);
    setHasLoadedDetails(false);
    setSelectedSections([]);
    setPagination({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
    });

    setOrdersSort({
      key: "",
      direction: "asc",
    });
  }
  const syncMutation = useMutation({
    mutationFn: syncOrdersFromOracle,
    onSuccess: (result) => {
      showMessage(
        result?.message ||
          `Orders synchronized successfully. Inserted: ${result?.insertedCount || 0}`,
        "success",
      );
    },
    onError: (error) => {
      showMessage(
        error?.response?.data?.message || "Failed to synchronize orders.",
        "error",
      );
    },
  });
  async function runOrdersSync(silent = false) {
    console.log("runOrdersSync run inside PrescriptionOrdersTab");
    try {
      const result = await syncMutation.mutateAsync();

      if (!silent) {
        showMessage(
          result?.message ||
            `Orders synchronized successfully. Inserted: ${result?.insertedCount || 0}`,
          "success",
        );
      }

      return result;
    } catch (error) {
      if (!silent) {
        showMessage(
          error?.response?.data?.message || "Failed to synchronize orders.",
          "error",
        );
      }
      return null;
    }
  }
  useEffect(() => {
    async function initPage() {
      const today = new Date().toISOString().split("T")[0];

      setDateFrom(today);
      setDateTo(today);

      await runOrdersSync(true);

      ordersMutation.mutate({
        patientCode: "",
        dateFrom: today,
        dateTo: today,
        sections: [],
      });

      setHasSearchedOrders(true);
    }

    initPage();
  }, []);
  // useEffect(() => {
  //   const intervalId = setInterval(
  //     () => {
  //       runOrdersSync(true);
  //     },
  //     15 * 60 * 1000,
  //   );

  //   return () => clearInterval(intervalId);
  // }, []);
  const patientMutation = useMutation({
    mutationFn: getPatientByCode,
    onSuccess: (data) => {
      setPatientName(data.patientName || "");
      setMessage({ text: "", type: "" });
    },
    onError: () => {
      setPatientName("");
      // setMessage({ text: "Patient not found.", type: "error" });
      showMessage("Patient not found.", "error");
    },
  });
  const orderByNoMutation = useMutation({
    mutationFn: getOrderByNo,
  });
  const ordersMutation = useMutation({
    mutationFn: searchOrders,
    onSuccess: (res) => {
      setOrders(res.data || []);
      setPagination(res.pagination || {});

      setDetails([]);
      setSelectedOrderNo("");
      setSelectedItems([]);
      setHasSearchedOrders(true);
      setHasLoadedDetails(false);
      setMessage({ text: "", type: "" });
    },
    onError: (error) => {
      setOrders([]);
      setDetails([]);
      setSelectedOrderNo("");
      setSelectedItems([]);
      setHasSearchedOrders(true);
      setHasLoadedDetails(false);
      // setMessage({
      //   text: error?.response?.data?.message || "Failed to load orders.",
      //   type: "error",
      // });
      showMessage(
        error?.response?.data?.message || "Failed to load orders.",
        "error",
      );
    },
  });

  const detailsMutation = useMutation({
    mutationFn: getOrderDetails,
    onSuccess: (data, orderNo) => {
      setSelectedOrderNo(orderNo);
      setDetails(data || []);
      setSelectedItems([]);
      setHasLoadedDetails(true);
      setMessage({ text: "", type: "" });
    },
    onError: (error) => {
      setDetails([]);
      setSelectedItems([]);
      setSelectedOrderNo("");
      setHasLoadedDetails(true);
      // setMessage({
      //   text: error?.response?.data?.message || "Order number not found.",
      //   type: "error",
      // });
      showMessage(
        error?.response?.data?.message || "Order number not found.",
        "error",
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ orderNo, payload }) => saveOrderItems(orderNo, payload),
    onSuccess: (result) => {
      setDetails(result.details || []);
      setSelectedItems([]);
      // setMessage({
      //   text: result.message || "Saved successfully.",
      //   type: "success",
      // });
      showMessage(result.message || "Saved successfully.", "success");
      setSaveNotes("");
      setIsModalOpen(false);
    },
  });

  async function handlePatientBlur() {
    const code = patientCode.trim();

    if (!code) {
      setPatientName("");
      return;
    }

    patientMutation.mutate(code);
  }

  async function handleSearchOrders() {
    const trimmedPatientCode = patientCode.trim();
    let finalDateFrom = dateFrom;
    let finalDateTo = dateTo;

    const hasPatientCode = !!trimmedPatientCode;
    const hasFromDate = !!finalDateFrom;
    const hasToDate = !!finalDateTo;

    if (!hasPatientCode && !hasFromDate) {
      showMessage(
        "Please enter Patient Code or choose From Date before searching.",
        "error",
      );
      return;
    }

    if (!hasFromDate && hasToDate) {
      showMessage("Please enter From Date when using To Date.", "error");
      return;
    }

    if (hasFromDate && !hasToDate) {
      finalDateTo = new Date().toISOString().split("T")[0];
      setDateTo(finalDateTo);
    }
    const page = 1;

    setPagination((prev) => ({ ...prev, page }));

    ordersMutation.mutate({
      patientCode: patientCode.trim(),
      dateFrom,
      dateTo,
      sections: selectedSections,
      page,
      pageSize: pagination.pageSize,
      sortBy: ordersSort.key,
      sortDirection: ordersSort.direction,
    });
  }
  async function handleSelectOrder(orderNo) {
    detailsMutation.mutate(orderNo);
  }

  async function handleSearchByOrderNo() {
    const orderNo = orderSearch.trim();

    if (!orderNo) {
      showMessage("Please enter an order number.", "error");
      return;
    }

    try {
      const [orderRow, orderDetails] = await Promise.all([
        orderByNoMutation.mutateAsync(orderNo),
        detailsMutation.mutateAsync(orderNo),
      ]);

      const results = orderRow ? [orderRow] : [];

      setOrders(results);

      // ✅ RESET PAGINATION
      setPagination({
        page: 1,
        pageSize: pagination.pageSize,
        total: results.length,
        totalPages: 1,
        hasNext: false,
      });
      // ✅ CLEAR FILTERS (HERE 👇)
      setSelectedSections([]);
      setDateFrom("");
      setDateTo("");
      setSelectedOrderNo(orderNo);
      setDetails(orderDetails || []);
      setSelectedItems([]);
      setHasSearchedOrders(true);
      setHasLoadedDetails(true);

      showMessage(`Showing details for order ${orderNo}.`, "success");
    } catch (error) {
      setOrders([]);
      setDetails([]);
      setSelectedOrderNo("");
      setSelectedItems([]);
      setHasSearchedOrders(true);
      setHasLoadedDetails(true);

      showMessage(
        error?.response?.data?.message || "Order number not found.",
        "error",
      );
    }
  }

  function toggleItem(itemId) {
    const item = details.find((d) => d.id === itemId);

    if (!item || isItemAlreadySaved(item)) return;

    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  }

  function toggleAll() {
    const availableItems = filteredDetails.filter(
      (item) => !isItemAlreadySaved(item),
    );
    const availableIds = availableItems.map((item) => item.id);

    if (
      availableIds.length > 0 &&
      availableIds.every((id) => selectedItems.includes(id))
    ) {
      setSelectedItems((prev) =>
        prev.filter((id) => !availableIds.includes(id)),
      );
      return;
    }

    setSelectedItems((prev) => [...new Set([...prev, ...availableIds])]);
  }

  async function handleConfirmSave({ userCode, password, notes }) {
    try {
      await saveMutation.mutateAsync({
        orderNo: selectedOrderNo,
        payload: {
          selectedItems,
          userCode,
          password,
          notes,
        },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Save failed.",
      };
    }
  }
  function openSaveModal() {
    if (!selectedItems.length) {
      // setMessage({
      //   text: "Please select at least one item before saving.",
      //   type: "error",
      // });
      showMessage("Please select at least one item before saving.", "error");

      return;
    }

    setIsModalOpen(true);
  }
  const savedCount = details.filter((item) => isItemAlreadySaved(item)).length;

  const unsavedCount = details.filter(
    (item) => !isItemAlreadySaved(item),
  ).length;

  const filteredDetails = useMemo(() => {
    if (detailsFilter === "saved") {
      return details.filter((item) => isItemAlreadySaved(item));
    }

    if (detailsFilter === "unsaved") {
      return details.filter((item) => !isItemAlreadySaved(item));
    }

    return details;
  }, [details, detailsFilter]);
  const sortedDetails = useMemo(() => {
    if (!detailsSort.key) return filteredDetails;

    const cloned = [...filteredDetails];

    cloned.sort((a, b) =>
      compareValues(
        a[detailsSort.key],
        b[detailsSort.key],
        detailsSort.direction,
      ),
    );

    return cloned;
  }, [filteredDetails, detailsSort]);
  const selectableItems = filteredDetails.filter(
    (item) => !isItemAlreadySaved(item),
  );

  const allSelected = useMemo(() => {
    return (
      selectableItems.length > 0 &&
      selectableItems.every((item) => selectedItems.includes(item.id))
    );
  }, [selectableItems, selectedItems]);

  const ordersCount = pagination.total;
  const detailsCount = details.length;
  const selectedCount = selectedItems.length;
  const isOrdersTableLoading =
    syncMutation.isPending || ordersMutation.isPending;
  return (
    <div className="">
      <div className="">
        <div className="mb-5 rounded-[18px] border border-[#d7ccc8] bg-white p-[18px] shadow-[0_8px_20px_rgba(78,52,46,0.06)]">
          <h2 className="mb-4 text-lg font-bold text-[#4e342e]">
            Search Criteria
          </h2>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.4fr_1fr_1fr_1.2fr_auto]">
            {" "}
            {/* Patient Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6d4c41]">
                Patient Code
              </label>
              <input
                placeholder="Enter patient code"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                onBlur={handlePatientBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePatientBlur();
                    e.target.blur();
                  }
                }}
                className="h-[46px] rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3.5 text-sm outline-none focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30"
              />
            </div>
            {/* Patient Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6d4c41]">
                Patient Name
              </label>
              <input
                value={patientName}
                readOnly
                placeholder="Auto-filled"
                className="h-[46px] rounded-[10px] border border-[#bcaaa4] bg-[#f7f1ee] px-3.5 text-sm outline-none"
              />
            </div>
            {/* From Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6d4c41]">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-[46px] rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3.5 text-sm outline-none focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30"
              />
            </div>
            {/* To Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6d4c41]">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-[46px] rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3.5 text-sm outline-none focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6d4c41]">
                Sections
              </label>

              <SearchableMultiSelect
                name="sections"
                values={selectedSections}
                onChange={(e) => setSelectedSections(e.target.value)}
                options={sections}
                disabled={sectionsLoading}
                placeholder="Select sections"
                searchPlaceholder="Search sections..."
                noResultsText="No sections found"
                getOptionLabel={(item) => item.sectionName}
                getOptionValue={(item) => item.sectionName}
              />
            </div>
            {/* Search Button */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearchOrders}
                disabled={ordersMutation.isPending}
                className="h-[46px] rounded-xl bg-gradient-to-br from-[#5d4037] to-[#795548] px-[18px] text-sm font-bold text-white disabled:opacity-60"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={
                  ordersMutation.isPending ||
                  detailsMutation.isPending ||
                  saveMutation.isPending
                }
                className="h-[46px] rounded-xl border border-[#d7ccc8] bg-white px-[18px] text-sm font-bold text-[#5d4037] transition hover:bg-[#f7f1ee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear All
              </button>
            </div>
          </div>
          {/* {message.text && (
              <div className="mb-4">
                <MessageBox message={message} />
              </div>
            )} */}
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <StatCard label="Orders" value={ordersCount} />
          <StatCard label="Details" value={detailsCount} />
          <StatCard label="Selected Items" value={selectedCount} />
          <StatCard
            label="Current Order No."
            value={selectedOrderNo || "---"}
          />
        </div>

        <div className="grid grid-cols-1 gap-[18px]">
          <div className="rounded-[18px] border border-[#d7ccc8] bg-white p-4">
            {" "}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#4e342e]">Orders</h2>

              {hasSearchedOrders && !isOrdersTableLoading && (
                <div className="flex flex-col items-end">
                  <span className="text-sm text-[#6d4c41]">
                    {pagination.total} result{pagination.total !== 1 && "s"}{" "}
                    found
                  </span>

                  {ordersSort.key && (
                    <span className="text-xs text-[#8d6e63]">
                      Sorted by {ordersSort.key} ({ordersSort.direction})
                    </span>
                  )}
                </div>
              )}
            </div>{" "}
            <div className=" max-h-[320px] overflow-auto rounded-[14px] border border-[#d7ccc8]">
              {" "}
              <table className="w-full min-w-[1200px] text-left">
                <thead className="sticky top-0 z-10 bg-[#f4ece8]">
                  {" "}
                  <tr className="bg-[#f4ece8] text-xs uppercase tracking-wide text-[#6d4c41]">
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleOrdersSort("orderNo")}
                    >
                      Order No. {renderSortArrow(ordersSort, "orderNo")}
                    </th>

                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleOrdersSort("orderDate")}
                    >
                      Date {renderSortArrow(ordersSort, "orderDate")}
                    </th>
                    <th
                      className="cursor-pointer whitespace-nowrap p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleOrdersSort("patientCode")}
                    >
                      Patient Code {renderSortArrow(ordersSort, "patientCode")}
                    </th>

                    <th
                      className="cursor-pointer whitespace-nowrap p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleOrdersSort("patientName")}
                    >
                      Patient Name {renderSortArrow(ordersSort, "patientName")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleOrdersSort("doctor")}
                    >
                      Doctor {renderSortArrow(ordersSort, "doctor")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleOrdersSort("sectionName")}
                    >
                      Section {renderSortArrow(ordersSort, "sectionName")}
                    </th>
                  </tr>
                </thead>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.tbody
                    key={
                      isOrdersTableLoading
                        ? "orders-loading"
                        : !hasSearchedOrders
                          ? "orders-idle"
                          : orders.length === 0
                            ? "orders-empty"
                            : `orders-${orders.map((o) => o.orderNo).join("-")}`
                    }
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                  >
                    {isOrdersTableLoading ? (
                      <tr>
                        <td colSpan={6}>
                          <TableSpinner text="Loading orders..." />
                        </td>
                      </tr>
                    ) : !hasSearchedOrders ? (
                      <tr>
                        <td colSpan={6}>
                          <TableEmptyState
                            title="No search yet"
                            subtitle="Enter Patient Code or date filters, then click Search."
                          />
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <TableEmptyState
                            title="No orders found"
                            subtitle="No results matched the selected filters."
                          />
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => {
                        const isActive = selectedOrderNo === o.orderNo;

                        return (
                          <tr
                            key={o.orderNo}
                            onClick={() => handleSelectOrder(o.orderNo)}
                            className={`border-b cursor-pointer transition-all duration-200 ${
                              isActive
                                ? "bg-[rgba(21,98,160,0.12)] border-l-[4px] border-l-[rgb(21,98,160)]"
                                : "hover:bg-gray-100 "
                            }`}
                          >
                            <td className="p-3 whitespace-nowrap">
                              {o.orderNo}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {formatDate(o.orderDate)}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {o.patientCode || "-"}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {o.patientName || "-"}
                            </td>
                            <td className="p-3">{o.doctor}</td>

                            <td className="p-3">{o.sectionName}</td>
                          </tr>
                        );
                      })
                    )}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>
            <TablePagination
              pagination={pagination}
              onPrev={() => {
                const newPage = pagination.page - 1;

                setPagination((prev) => ({ ...prev, page: newPage }));

                ordersMutation.mutate({
                  patientCode: patientCode.trim(),
                  dateFrom,
                  dateTo,
                  sections: selectedSections,
                  page: newPage,
                  pageSize: pagination.pageSize,
                  sortBy: ordersSort.key,
                  sortDirection: ordersSort.direction,
                });
              }}
              onNext={() => {
                const newPage = pagination.page + 1;

                setPagination((prev) => ({ ...prev, page: newPage }));

                ordersMutation.mutate({
                  patientCode: patientCode.trim(),
                  dateFrom,
                  dateTo,
                  sections: selectedSections,
                  page: newPage,
                  pageSize: pagination.pageSize,
                  sortBy: ordersSort.key,
                  sortDirection: ordersSort.direction,
                });
              }}
            />
          </div>

          <div className="rounded-[18px] border border-[#d7ccc8] bg-white p-4">
            {" "}
            <div className="mb-4 flex justify-between gap-3">
              <h2 className="text-lg font-bold text-[#4e342e]">
                Order Details
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <Filter className="absolute left-3 h-4 w-4 text-[#8d6e63]" />

                  <select
                    value={detailsFilter}
                    onChange={(e) => setDetailsFilter(e.target.value)}
                    className="h-[46px] min-w-[190px] appearance-none rounded-xl border border-[#d7ccc8] bg-white pl-10 pr-10 text-sm font-semibold text-[#4e342e] shadow-sm outline-none transition-all duration-200 focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30 hover:border-[#a1887f]"
                  >
                    <option value="all">All Items ({details.length})</option>
                    <option value="saved">Saved Only ({savedCount})</option>
                    <option value="unsaved">
                      Unsaved Only ({unsavedCount})
                    </option>
                  </select>

                  <div className="pointer-events-none absolute right-3 text-[#6d4c41]">
                    ▼
                  </div>
                </div>

                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchByOrderNo();
                    }
                  }}
                  placeholder="Quick search by order number"
                  className="h-[46px] min-w-0 rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3.5 text-sm outline-none sm:min-w-[280px]"
                />

                <button
                  type="button"
                  onClick={handleSearchByOrderNo}
                  disabled={detailsMutation.isPending}
                  className="h-[46px] cursor-pointer rounded-xl bg-gradient-to-br from-[#5d4037] to-[#795548] px-5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(93,64,55,0.3)] transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                >
                  View
                </button>
              </div>
            </div>
            <div className="max-h-[420px] overflow-auto rounded-[14px] border border-[#d7ccc8]">
              {" "}
              <table className="w-full min-w-[1600px] text-left">
                <thead className="sticky top-0 z-10 bg-[#f4ece8]">
                  {" "}
                  <tr className="bg-[#f4ece8] text-xs uppercase tracking-wide text-[#6d4c41]">
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("orderNo")}
                    >
                      Order No. {renderSortArrow(detailsSort, "orderNo")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("orderDate")}
                    >
                      Order Date {renderSortArrow(detailsSort, "orderDate")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("medicationCode")}
                    >
                      Medication Code{" "}
                      {renderSortArrow(detailsSort, "medicationCode")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("medicationName")}
                    >
                      Medication Name{" "}
                      {renderSortArrow(detailsSort, "medicationName")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("actionDate")}
                    >
                      Action Date {renderSortArrow(detailsSort, "actionDate")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("endDate")}
                    >
                      End Date {renderSortArrow(detailsSort, "endDate")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("savedByUserCode")}
                    >
                      Saved By Code{" "}
                      {renderSortArrow(detailsSort, "savedByUserCode")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("savedByUserName")}
                    >
                      Saved By Name{" "}
                      {renderSortArrow(detailsSort, "savedByUserName")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("savedAt")}
                    >
                      Saved At {renderSortArrow(detailsSort, "savedAt")}
                    </th>
                    <th
                      className="cursor-pointer p-3 select-none hover:text-[#4e342e]"
                      onClick={() => handleDetailsSort("notes")}
                    >
                      Notes {renderSortArrow(detailsSort, "notes")}
                    </th>
                    <th className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                      />
                    </th>
                  </tr>
                </thead>

                <motion.tbody
                  key={selectedOrderNo || "empty-details"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  {detailsMutation.isPending ? (
                    <tr>
                      <td colSpan={11}>
                        <TableSpinner text="Loading order details..." />
                      </td>
                    </tr>
                  ) : !hasLoadedDetails ? (
                    <tr>
                      <td colSpan={11}>
                        <TableEmptyState
                          title="No order selected"
                          subtitle="Click any order row or search directly by order number."
                        />
                      </td>
                    </tr>
                  ) : filteredDetails.length === 0 ? (
                    <tr>
                      <td colSpan={11}>
                        <TableEmptyState
                          title="No details found"
                          subtitle={
                            details.length === 0
                              ? "This order has no item details."
                              : `No ${detailsFilter} items found for this order.`
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    sortedDetails.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() => toggleItem(d.id)}
                        className={`h-[56px]  cursor-pointer border-b transition-all duration-150
  ${
    isItemAlreadySaved(d)
      ? "bg-[#f7f1ee] text-[#8d6e63] cursor-not-allowed"
      : selectedItems.includes(d.id)
        ? "bg-[rgba(21,98,160,0.12)] border-l-[4px] border-l-[rgb(21,98,160)]"
        : "hover:bg-gray-50"
  }
`}
                      >
                        <td className="p-3 whitespace-nowrap">{d.orderNo}</td>
                        <td className="p-3 max-w-[220px] truncate">
                          {formatDate(d.orderDate)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {d.medicationCode}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {d.medicationName}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatDate(d.actionDate)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatDate(d.endDate)}
                        </td>
                        <td className="p-3">{d.savedByUserCode || "-"}</td>
                        <td className="p-3">{d.savedByUserName || "-"}</td>
                        <td className="p-3">{formatDate(d.savedAt)}</td>{" "}
                        <td className="p-3 max-w-[260px] whitespace-pre-wrap break-words">
                          {d.notes || "-"}
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(d.id)}
                            disabled={isItemAlreadySaved(d)}
                            onClick={(e) => e.stopPropagation()} // ✅ prevent row click
                            onChange={() => toggleItem(d.id)}
                            className="h-[18px] w-[18px] accent-[#6d4c41] disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </motion.tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {/* Selected count */}
              <span className="text-sm text-[#6d4c41]">
                {selectedItems.length} item{selectedItems.length !== 1 && "s"}{" "}
                selected
              </span>

              {/* Save button */}
              <button
                onClick={openSaveModal}
                disabled={!selectedItems.length || saveMutation.isPending}
                className="rounded-xl bg-[#5d4037] px-4 py-2 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
            <MessageBox message={message} />
          </div>
        </div>
      </div>

      <SaveModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        loading={saveMutation.isPending}
        selectedCount={selectedCount}
        defaultNotes={saveNotes}
      />
    </div>
  );
}
