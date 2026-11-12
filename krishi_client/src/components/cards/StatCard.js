"use client";

import React from "react";

export default function StatCard({
  value,
  label,
  subtext = null,
  unit = null,
  className = "",
}) {
  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between space-y-3 ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono"
          style={{ color: "var(--primary)" }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-base font-bold"
            style={{ color: "var(--accent)" }}
          >
            {unit}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4
          className="text-sm sm:text-base font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {label}
        </h4>
        {subtext && (
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
