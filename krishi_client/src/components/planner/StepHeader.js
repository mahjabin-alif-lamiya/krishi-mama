"use client";

import React from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatNumber } from "@/lib/formatNumber";

export default function StepHeader({
  currentStep = 1,
  title,
  subtitle = null,
}) {
  const { t, language } = useLanguage();

  const steps = [
    { num: 1, label: t("planner.stepPlace") || (language === "bn" ? "স্থান" : "Place") },
    { num: 2, label: t("planner.stepSoil") || (language === "bn" ? "মাটি" : "Soil") },
    { num: 3, label: t("planner.stepCrop") || (language === "bn" ? "ফসল" : "Crop") },
    { num: 4, label: t("planner.stepGoal") || (language === "bn" ? "লক্ষ্য" : "Goal") },
    { num: 5, label: t("planner.stepAdvice") || (language === "bn" ? "পরামর্শ" : "Advice") },
  ];

  return (
    <div className="surface-dark w-full py-6 sm:py-8 text-center relative transition-colors shadow-sm">
      <div className="surface-pattern" />
      <div className="surface-glow" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
        {/* Main Question as Heading */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-[#F5FAF6] max-w-2xl mx-auto">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#B7D3C0] font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* 5-Step Visual Progress Indicator */}
        <div className="pt-2">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            {/* Background track line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-white/15 -z-0" />

            {steps.map((st) => {
              const isDone = st.num < currentStep;
              const isCurrent = st.num === currentStep;

              return (
                <div
                  key={st.num}
                  className="relative z-10 flex flex-col items-center gap-1.5"
                >
                  {/* Step Dot/Badge */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-[#E5B84A] text-[#0B3A22] ring-4 ring-[#E5B84A]/25 shadow-md scale-105"
                        : isDone
                        ? "bg-[#16A34A] text-white border border-[#16A34A]"
                        : "bg-[#0B3A22] text-[#B7D3C0]/60 border border-white/20"
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      formatNumber(st.num, language)
                    )}
                  </div>

                  {/* Short Label */}
                  <span
                    className={`text-[11px] sm:text-xs font-medium tracking-tight ${
                      isCurrent
                        ? "text-[#E5B84A] font-bold"
                        : isDone
                        ? "text-[#F5FAF6]"
                        : "text-[#B7D3C0]/60"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
