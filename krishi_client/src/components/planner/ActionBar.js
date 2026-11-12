"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ActionBar({
  onBack,
  onNext,
  isNextDisabled = false,
  nextLabel = null,
  backLabel = null,
  showBack = true,
}) {
  const { t } = useLanguage();

  const labelNext = nextLabel || t("planner.btnNext") || "Next";
  const labelBack = backLabel || t("planner.btnBack") || "Back";

  return (
    <div
      className="sticky bottom-0 z-40 w-full sm:static transition-colors border-t sm:border-0 p-4 sm:p-0 sm:pt-6 mt-8 sm:mt-10"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Back Button */}
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-semibold border shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{labelBack}</span>
          </button>
        ) : (
          <div />
        )}

        {/* Next Button (Primary, Gold) */}
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 active:scale-95"
          style={{
            backgroundColor: "#E5B84A",
            color: "#0B3A22",
          }}
        >
          <span>{labelNext}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
