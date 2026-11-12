"use client";

import React from "react";
import { CheckCircle2, Droplet, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatNumber } from "@/lib/formatNumber";

/**
 * NextStepsCard: Displays exactly 3 short, farmer-friendly action lines with icons.
 *
 * @param {Object} props
 * @param {Array<{ id: number, iconType: "check" | "droplet" | "clock", text: { bn: string, en: string } }>} props.steps
 */
export default function NextStepsCard({ steps = [], className = "" }) {
  const { t, language } = useLanguage();

  const getStepIcon = (iconType) => {
    switch (iconType) {
      case "droplet":
        return <Droplet className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
      case "clock":
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
      case "check":
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    }
  };

  const getStepBg = (iconType) => {
    switch (iconType) {
      case "droplet":
        return "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/40";
      case "clock":
        return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40";
      case "check":
      default:
        return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40";
    }
  };

  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl border shadow-sm space-y-5 transition-all ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
          {t("planner.nextStepsTitle")}
        </h3>
        <span
          className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          {formatNumber(3, language)} {language === "bn" ? "ধাপ" : "Steps"}
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((st, index) => {
          const text = st.text?.[language] || st.text?.en || "";
          const iconType = st.iconType || (index === 0 ? "check" : index === 1 ? "droplet" : "clock");

          return (
            <div
              key={st.id || index}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3.5 transition-all ${getStepBg(
                iconType
              )}`}
            >
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                {getStepIcon(iconType)}
              </div>

              <div className="space-y-0.5">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider block opacity-70"
                  style={{ color: "var(--muted)" }}
                >
                  {language === "bn"
                    ? `ধাপ ${formatNumber(index + 1, "bn")}`
                    : `Step ${index + 1}`}
                </span>
                <p
                  className="text-sm font-semibold leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  {text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
