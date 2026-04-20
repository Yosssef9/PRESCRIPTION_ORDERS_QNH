import { BarChart } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import UserAvatar from "./UserAvatar";

export default function MedicationOrdersHeader({ activeTab }) {
  const { user, loading } = useAuth();

  return (
    <div className="flex items-center justify-between bg-gradient-to-br from-[#4e342e] to-[#6d4c41] px-7 py-6 text-white">
      <h1 className="text-[28px] font-bold">
        {activeTab === "orders"
          ? "Doctors' Medication Orders"
          : "Unit Dose Orders"}
      </h1>

      <div className="flex items-center gap-3">
        <UserAvatar user={user} loading={loading} />
      </div>
    </div>
  );
}
