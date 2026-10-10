"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatNumber } from "@/lib/formatNumber";

export default function RiskCard({
  delayLabel,
  riskPercent,
  description,
  highlight = false,
  className = "",
}) {
  const { t, language } = useLanguage();

  const numRisk = typeof riskPercent === "number" ? riskPercent : parseFloat(riskPercent) || 0;

  // Determine risk level, color, icon, and label
  let riskColor = "var(--risk-safe)";
  let RiskIcon = CheckCircle2;
  let riskLevelLabel = t("risk.safe");

  if (numRisk < 25) {
    riskColor = "var(--risk-safe)";
    RiskIcon = CheckCircle2;
    riskLevelLabel = t("risk.safe");
  } else if (numRisk <= 50) {
    riskColor = "var(--risk-caution)";
    RiskIcon = AlertTriangle;
    riskLevelLabel = t("risk.caution");
  } else {
    riskColor = "var(--risk-danger)";
    RiskIcon = XCircle;
    riskLevelLabel = t("risk.danger");
  }

  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between space-y-5 relative ${
        highlight ? "ring-2" : ""
      } ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: highlight ? "var(--primary)" : "var(--border)",
        outlineColor: "var(--primary)",
      }}
    >
      {/* Safest Option Highlight Pill */}
      {highlight && (
        <div className="absolute -top-3 right-5">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs"
            style={{
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>{t("common.safestOption")}</span>
          </span>
        </div>
      )}

      {/* Top: Delay Label + Risk Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {delayLabel}
          </span>

          {/* Accessible Icon + Risk Label */}
          <div
            className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs"
            style={{
              borderColor: riskColor,
              color: riskColor,
              backgroundColor: "var(--background)",
            }}
          >
            <RiskIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{riskLevelLabel}</span>
          </div>
        </div>

        {/* Big Risk Number Display */}
        <div className="flex items-baseline gap-1">
          <span
            className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight"
            style={{ color: riskColor }}
          >
            {formatNumber(numRisk, language)}%
          </span>
        </div>

        {/* Single plain sentence explanation */}
        <p
          className="text-xs sm:text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>
      </div>

      {/* Visual Indicator Bar */}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(Math.max(numRisk, 5), 100)}%`,
            backgroundColor: riskColor,
          }}
        />
      </div>
    </div>
  );
}
