import { useNavigate } from "react-router-dom";
import { BarChart } from "lucide-react";

export default function Tabs({ activeTab, onChange, onRefresh }) {
  const navigate = useNavigate();

  const tabs = [
    { key: "orders", label: "Prescription Orders" },
    { key: "unitDose", label: "Unit Dose" },
  ];
  function handleOpenReport() {
    if (activeTab === "orders") {
      navigate("/PrescriptionOrdersReport");
      return;
    }

    navigate("/UnitDoseReport");
  }

  return (
    <div className="flex justify-between items-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-[18px] border border-[#d7ccc8] bg-white p-2 shadow-[0_8px_20px_rgba(78,52,46,0.06)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                isActive
                  ? "bg-gradient-to-br from-[#5d4037] to-[#795548] text-white shadow-[0_4px_12px_rgba(93,64,55,0.28)]"
                  : "text-[#6d4c41] hover:bg-[#f7f1ee]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleOpenReport}
          className="inline-flex items-center gap-2 rounded-xl border border-[#d7ccc8] bg-white px-4 py-2 text-sm font-bold text-[#5d4037] shadow-[0_4px_12px_rgba(78,52,46,0.08)] transition hover:bg-[#f7f1ee]"
        >
          <BarChart className="h-4 w-4" />
          {activeTab === "orders"
            ? "Prescription Orders Report"
            : "Unit Dose Report"}
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-[#d7ccc8] bg-white px-4 py-2 text-sm font-bold text-[#5d4037] shadow-[0_4px_12px_rgba(78,52,46,0.08)] transition hover:bg-[#f7f1ee]"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
