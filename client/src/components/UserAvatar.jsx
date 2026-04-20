import React from "react";

export default function UserAvatar({ user, loading, className = "" }) {
  if (loading) {
    return (
      <div
        className={`h-9 w-24 animate-pulse rounded-full bg-white/20 ${className}`}
      />
    );
  }

  if (!user) return null;

  const firstLetter = user?.userName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm border border-white/20 ${className}`}
    >
      {/* Avatar */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5d4037] font-bold text-sm">
        {firstLetter}
      </div>

      {/* Username */}
      <span className="text-sm font-semibold text-white whitespace-nowrap">
        {`Dr. ${user?.userName || ""}`}
      </span>
    </div>
  );
}