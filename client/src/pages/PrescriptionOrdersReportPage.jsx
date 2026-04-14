import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getSections, searchOrdersReport } from "../api/prescriptionOrdersApi";
import { formatDate } from "../helpers/formatDate";
import SearchableMultiSelect from "../components/SearchableMultiSelect";
import TableSpinner from "../components/TableSpinner";
import TableEmptyState from "../components/TableEmptyState";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart } from "lucide-react";

export default function PrescriptionOrdersReportPage() {
  const [patientCode, setPatientCode] = useState("");
  const [patientName, setPatientName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [orderNo, setOrderNo] = useState("");
  const [medicationCode, setMedicationCode] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [actionDate, setActionDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [savedByCode, setSavedByCode] = useState("");
  const [savedByName, setSavedByName] = useState("");
  const [rows, setRows] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  const navigate = useNavigate();

  function showMessage(text, type = "success") {
    if (!text) return;
    toast.dismiss();
    if (type === "success") toast.success(text);
    else toast.error(text);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSections() {
      try {
        setSectionsLoading(true);
        const data = await getSections();
        if (isMounted) setSections(data || []);
      } catch {
        if (isMounted) {
          setSections([]);
          showMessage("Failed to load sections.", "error");
        }
      } finally {
        if (isMounted) setSectionsLoading(false);
      }
    }

    loadSections();

    return () => {
      isMounted = false;
    };
  }, []);

  const reportMutation = useMutation({
    mutationFn: searchOrdersReport,
    onSuccess: (data) => {
      setRows(data || []);
      setHasSearched(true);
    },
    onError: (error) => {
      setRows([]);
      setHasSearched(true);
      showMessage(
        error?.response?.data?.message || "Failed to load report.",
        "error",
      );
    },
  });

  function handleSearch() {
    reportMutation.mutate({
      patientCode,
      patientName,
      dateFrom,
      dateTo,
      sections: selectedSections,
      orderNo,
      medicationCode,
      medicationName,
      actionDate,
      endDate,
      savedByCode,
      savedByName,
    });
  }

  function handleClearAll() {
    setPatientCode("");
    setPatientName("");
    setDateFrom("");
    setDateTo("");
    setSelectedSections([]);
    setOrderNo("");
    setMedicationCode("");
    setMedicationName("");
    setActionDate("");
    setEndDate("");
    setSavedByCode("");
    setSavedByName("");
    setRows([]);
    setHasSearched(false);
  }

  function handleExportExcel() {
    if (!rows.length) {
      showMessage("No report data to export.", "error");
      return;
    }

    const exportRows = rows.map((row) => ({
      "Order No.": row.orderNo,
      "Order Date": formatDate(row.orderDate),
      Doctor: row.doctor,
      Section: row.sectionName,
      "Patient Code": row.patientCode,
      "Patient Name": row.patientName,
      "Medication Code": row.medicationCode,
      "Medication Name": row.medicationName,
      "Action Date": formatDate(row.actionDate),
      "End Date": formatDate(row.endDate),
      "Saved By Code": row.savedByCode,
      "Saved By Name": row.savedByName,
      "Saved At": formatDate(row.savedAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "prescription-orders-report.xlsx");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(161,136,127,0.2),transparent_20%),linear-gradient(180deg,#f8f3f0_0%,#f2e9e4_100%)] p-6 text-[#4e342e]">
      <div className="mx-auto overflow-hidden rounded-[28px] border border-[rgba(121,85,72,0.14)] bg-[rgba(255,255,255,0.75)] shadow-[0_12px_30px_rgba(78,52,46,0.12)] backdrop-blur-md">
        <div className="flex items-center justify-between bg-gradient-to-br from-[#4e342e] to-[#6d4c41] px-7 py-6 text-white">
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6" />
            <h1 className="text-[28px] font-bold">
              Prescription Orders Report
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={!rows.length}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              Export Excel
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-[18px] border border-[#d7ccc8] bg-white p-[18px] shadow-[0_8px_20px_rgba(78,52,46,0.06)]">
            <h2 className="mb-4 text-lg font-bold text-[#4e342e]">
              Report Filters
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Patient Code
                </label>
                <input
                  value={patientCode}
                  onChange={(e) => setPatientCode(e.target.value)}
                  placeholder="Enter patient code"
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Patient Name
                </label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Order Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Order Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
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

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Order Number
                </label>
                <input
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="Enter order number"
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Medication Code
                </label>
                <input
                  value={medicationCode}
                  onChange={(e) => setMedicationCode(e.target.value)}
                  placeholder="Enter medication code"
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Medication Name
                </label>
                <input
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="Enter medication name"
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Action Date
                </label>
                <input
                  type="date"
                  value={actionDate}
                  onChange={(e) => setActionDate(e.target.value)}
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Saved By Code
                </label>
                <input
                  value={savedByCode}
                  onChange={(e) => setSavedByCode(e.target.value)}
                  placeholder="Enter saved by code"
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium leading-none text-[#7b5e57]">
                  Saved By Name
                </label>
                <input
                  value={savedByName}
                  onChange={(e) => setSavedByName(e.target.value)}
                  placeholder="Enter saved by name"
                  className="h-[38px] w-full rounded-[8px] border border-[#bcaaa4] bg-[#fffdfc] px-3 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-1 focus:ring-[#bcaaa4]/30"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleSearch}
                disabled={reportMutation.isPending}
                className="h-[46px] rounded-xl bg-gradient-to-br from-[#5d4037] to-[#795548] px-[18px] text-sm font-bold text-white disabled:opacity-60"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={reportMutation.isPending}
                className="h-[46px] rounded-xl border border-[#d7ccc8] bg-white px-[18px] text-sm font-bold text-[#5d4037] transition hover:bg-[#f7f1ee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-[18px] border border-[#d7ccc8] bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#4e342e]">
                Report Result
              </h2>
              {hasSearched && !reportMutation.isPending && (
                <span className="text-sm text-[#6d4c41]">
                  {rows.length} result{rows.length !== 1 && "s"} found
                </span>
              )}
            </div>

            <div className="max-h-[520px] overflow-auto rounded-[14px] border border-[#d7ccc8]">
              <table className="w-full min-w-[1600px] text-left">
                <thead className="sticky top-0 z-10 bg-[#f4ece8]">
                  <tr className="text-xs uppercase tracking-wide text-[#6d4c41]">
                    <th className="p-3">Order No.</th>
                    <th className="p-3">Order Date</th>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Patient Code</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Medication Code</th>
                    <th className="p-3">Medication Name</th>
                    <th className="p-3">Action Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Saved By Code</th>
                    <th className="p-3">Saved By Name</th>
                    <th className="p-3">Saved At</th>
                  </tr>
                </thead>

                <tbody>
                  {reportMutation.isPending ? (
                    <tr>
                      <td colSpan={13}>
                        <TableSpinner text="Loading report..." />
                      </td>
                    </tr>
                  ) : !hasSearched ? (
                    <tr>
                      <td colSpan={13}>
                        <TableEmptyState
                          title="No search yet"
                          subtitle="Enter report filters, then click Search."
                        />
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={13}>
                        <TableEmptyState
                          title="No report data found"
                          subtitle="No results matched the selected filters."
                        />
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => (
                      <tr
                        key={`${row.orderNo}-${row.medicationCode}-${index}`}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 whitespace-nowrap">{row.orderNo}</td>
                        <td className="p-3 whitespace-nowrap">
                          {formatDate(row.orderDate)}
                        </td>
                        <td className="p-3">{row.doctor}</td>
                        <td className="p-3">{row.sectionName}</td>
                        <td className="p-3">{row.patientCode}</td>
                        <td className="p-3">{row.patientName}</td>
                        <td className="p-3">{row.medicationCode}</td>
                        <td className="p-3">{row.medicationName}</td>
                        <td className="p-3 whitespace-nowrap">
                          {formatDate(row.actionDate)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatDate(row.endDate)}
                        </td>
                        <td className="p-3">{row.savedByCode || "-"}</td>
                        <td className="p-3">{row.savedByName || "-"}</td>
                        <td className="p-3 whitespace-nowrap">
                          {formatDate(row.savedAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
