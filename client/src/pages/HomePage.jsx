import { useState } from "react";
import MedicationOrdersHeader from "../components/MedicationOrdersHeader";
import Tabs from "../components/Tabs";
import PrescriptionOrdersTab from "../components/PrescriptionOrdersTab";
import UnitDoseTab from "../components/UnitDoseTab";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [refreshHandlers, setRefreshHandlers] = useState({
    orders: null,
    unitDose: null,
  });
  function setTabRefreshHandler(tabKey, handler) {
    setRefreshHandlers((prev) => ({
      ...prev,
      [tabKey]: handler,
    }));
  }

  function handleRefresh() {
    const handler = refreshHandlers[activeTab];
    if (handler) handler();
  }
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_right,rgba(161,136,127,0.2),transparent_20%),linear-gradient(180deg,#f8f3f0_0%,#f2e9e4_100%)] p-6 text-[#4e342e]">
      <div className="mx-auto overflow-hidden rounded-[28px] border border-[rgba(121,85,72,0.14)] bg-[rgba(255,255,255,0.75)] shadow-[0_12px_30px_rgba(78,52,46,0.12)] backdrop-blur-md">
        <MedicationOrdersHeader activeTab={activeTab} />

        <div className="p-6">
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            onRefresh={handleRefresh}
          />
          {activeTab === "orders" ? (
            <PrescriptionOrdersTab
              registerRefreshHandler={(handler) =>
                setTabRefreshHandler("orders", handler)
              }
            />
          ) : (
            <UnitDoseTab
              registerRefreshHandler={(handler) =>
                setTabRefreshHandler("unitDose", handler)
              }
            />
          )}{" "}
        </div>
      </div>
    </div>
  );
}
