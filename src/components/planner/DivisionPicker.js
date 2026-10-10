"use client";

import React from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DIVISIONS } from "@/lib/bangladesh-districts";

export default function DivisionPicker({
  selectedDivision = null,
  onSelectDivision,
}) {
  const { language } = useLanguage();

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {DIVISIONS.map((div) => {
          const isSelected = selectedDivision === div.id;
          const name = div.name[language] || div.name.en;

          return (
            <button
              key={div.id}
              type="button"
              onClick={() => onSelectDivision(div.id)}
              className={`min-h-[88px] sm:min-h-[100px] p-4 rounded-2xl border text-center flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer select-none hover:-translate-y-0.5 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-[#E5B84A]/40 shadow-md"
                  : "shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
              style={{
                backgroundColor: "var(--card)",
                borderColor: isSelected ? "#E5B84A" : "var(--border)",
              }}
            >
              {/* Checkmark badge at top-right when selected */}
              {isSelected && (
                <div
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center bg-[#E5B84A] text-[#0B3A22]"
                  aria-hidden="true"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <span
                className="text-base sm:text-lg font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
