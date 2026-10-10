"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { formatNumber } from "@/lib/formatNumber";

export default function StepCard({
  stepNumber = 1,
  title,
  description,
  className = "",
}) {
  const { language } = useLanguage();

  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between space-y-5 ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="space-y-4">
        {/* Only One Large Number Badge */}
        <div className="flex items-center">
          <span
            className="w-12 h-12 rounded-2xl text-xl font-bold flex items-center justify-center border shadow-xs"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              color: "var(--primary)",
            }}
          >
            {formatNumber(stepNumber, language)}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
