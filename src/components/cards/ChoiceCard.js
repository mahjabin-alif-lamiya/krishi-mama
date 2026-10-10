"use client";

import React from "react";
import { Check } from "lucide-react";

export default function ChoiceCard({
  icon: Icon = null,
  title,
  subtitle = null,
  description = null,
  badge = null,
  selected = false,
  onClick,
  className = "",
}) {
  const textDesc = description || subtitle;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[110px] sm:min-h-[120px] p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative group ${
        selected
          ? "ring-2 ring-[#E5B84A]/40 shadow-md"
          : "shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700"
      } ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: selected ? "#E5B84A" : "var(--border)",
      }}
    >
      {/* Top Row: Icon + Badge / Selected Check */}
      <div className="flex items-start justify-between w-full gap-3">
        {Icon ? (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs transition-colors shrink-0"
            style={{
              backgroundColor: selected
                ? "rgba(229, 184, 74, 0.15)"
                : "var(--background)",
              borderColor: selected ? "#E5B84A" : "var(--border)",
              color: selected ? "#E5B84A" : "var(--text)",
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {badge && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: selected ? "#E5B84A" : "var(--background)",
                borderColor: selected ? "#E5B84A" : "var(--border)",
                color: selected ? "#0B3A22" : "var(--muted)",
              }}
            >
              {badge}
            </span>
          )}

          {/* Selected Checkmark Badge (Gold when selected) */}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0"
            style={{
              backgroundColor: selected ? "#E5B84A" : "transparent",
              borderColor: selected ? "#E5B84A" : "var(--border)",
              color: selected ? "#0B3A22" : "transparent",
            }}
            aria-hidden="true"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Content: Title & Short Description */}
      <div className="space-y-1 mt-4">
        <h4
          className="text-base sm:text-lg font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h4>
        {textDesc && (
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {textDesc}
          </p>
        )}
      </div>
    </button>
  );
}
