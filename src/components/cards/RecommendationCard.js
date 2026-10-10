"use client";

import React from "react";
import { Sprout, Wheat, Sparkles, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatNumber } from "@/lib/formatNumber";

/**
 * RecommendationCard: Highlights the best crop on a prominent .surface-dark card.
 *
 * @param {Object} props
 * @param {Object} props.rotation - Rotation config object
 * @param {string} props.sentence - One plain sentence
 * @param {number} props.riskPercent - Sowing risk percentage
 * @param {"safe" | "caution" | "danger"} props.level - Risk level
 * @param {boolean} [props.isCompareAll=false] - Whether compare-all was chosen
 * @param {number} [props.rank=1] - Rank number
 */
export default function RecommendationCard({
  rotation,
  sentence,
  riskPercent = 0,
  level = "safe",
  isCompareAll = false,
  rank = 1,
  className = "",
}) {
  const { t, language } = useLanguage();

  const isWheat = rotation?.id?.includes("wheat");
  const CropIcon = isWheat ? Wheat : Sprout;

  // Level Badge configuration
  let badgeBg = "rgba(22, 163, 74, 0.25)";
  let badgeBorder = "rgba(34, 197, 94, 0.5)";
  let badgeText = "#4ADE80";
  let LevelIcon = CheckCircle2;
  let levelLabel = t("risk.safe");

  if (level === "caution") {
    badgeBg = "rgba(234, 179, 8, 0.25)";
    badgeBorder = "rgba(250, 204, 21, 0.5)";
    badgeText = "#FDE047";
    LevelIcon = AlertTriangle;
    levelLabel = t("risk.caution");
  } else if (level === "danger") {
    badgeBg = "rgba(220, 38, 38, 0.25)";
    badgeBorder = "rgba(248, 113, 113, 0.5)";
    badgeText = "#FCA5A5";
    LevelIcon = AlertCircle;
    levelLabel = t("risk.danger");
  }

  const cropTitle =
    rotation?.name?.[language] ||
    rotation?.name?.en ||
    (language === "bn" ? "আমন ধান → সরিষা" : "T. Aman Rice → Mustard");

  return (
    <div
      className={`surface-dark w-full rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10 space-y-6 ${className}`}
    >
      <div className="surface-pattern" />
      <div className="surface-glow" />

      <div className="relative z-10 space-y-6">
        {/* Top Row: Rank / Top Pick Badge & Level Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isCompareAll ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#E5B84A] text-[#0B3A22] shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  #{formatNumber(rank, language)} {t("planner.topPickBadge")}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#E5B84A] text-[#0B3A22] shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("planner.topPickBadge")}</span>
              </span>
            )}
          </div>

          {/* Color Level Badge with Icon */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs"
            style={{
              backgroundColor: badgeBg,
              borderColor: badgeBorder,
              color: badgeText,
            }}
          >
            <LevelIcon className="w-3.5 h-3.5 shrink-0" />
            <span>
              {levelLabel} ({formatNumber(riskPercent, language)}%)
            </span>
          </div>
        </div>

        {/* Center: Big Crop Icon + Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <CropIcon className="w-9 h-9 sm:w-11 sm:h-11 text-[#E5B84A]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5FAF6]">
              {cropTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#E5B84A] font-semibold leading-relaxed">
              {sentence}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
