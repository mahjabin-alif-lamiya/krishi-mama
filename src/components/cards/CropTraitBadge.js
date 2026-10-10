"use client";

import React from "react";
import { Droplet, Clock, Sprout, ShieldAlert, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatNumber } from "@/lib/formatNumber";

/**
 * Renders three small, concise icon badges for a crop rotation:
 * 1. Water Need (Droplet)
 * 2. Duration (Clock)
 * 3. Soil Health Effect (Sprout)
 */
export default function CropTraitBadge({
  waterNeed = "low",
  durationDays = 85,
  soilHealthEffect = "neutral",
  className = "",
}) {
  const { language } = useLanguage();

  // Water Need text & color
  let waterLabel = language === "bn" ? "কম পানি" : "Low Water";
  let waterColor = "var(--primary)";
  if (waterNeed === "medium") {
    waterLabel = language === "bn" ? "মাঝারি পানি" : "Med Water";
    waterColor = "var(--accent)";
  } else if (waterNeed === "high") {
    waterLabel = language === "bn" ? "বেশি পানি" : "High Water";
    waterColor = "var(--risk-danger)";
  }

  // Duration text
  const durationLabel =
    language === "bn"
      ? `${formatNumber(durationDays, "bn")} দিন`
      : `${formatNumber(durationDays, "en")}d`;

  // Soil Health Effect text & color
  let soilLabel = language === "bn" ? "মাটিতে নিরপেক্ষ" : "Neutral Soil";
  let soilColor = "var(--muted)";
  let soilBg = "var(--background)";

  if (soilHealthEffect === "builds nitrogen") {
    soilLabel = language === "bn" ? "নাইট্রোজেন যোগ করে" : "+Nitrogen (Legume)";
    soilColor = "var(--risk-safe)";
  } else if (soilHealthEffect === "depletes") {
    soilLabel = language === "bn" ? "পুষ্টি টানে" : "High Feeder";
    soilColor = "var(--risk-caution)";
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-semibold ${className}`}>
      {/* 1. Water Need Badge */}
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border shadow-3xs transition-colors"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
        title={language === "bn" ? "পানির প্রয়োজনীয়তা" : "Irrigation water need"}
      >
        <Droplet className="w-3 h-3 shrink-0" style={{ color: waterColor }} />
        <span>{waterLabel}</span>
      </span>

      {/* 2. Duration Badge */}
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border shadow-3xs transition-colors"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
        title={language === "bn" ? "ফসলের মেয়াদ" : "Crop duration"}
      >
        <Clock className="w-3 h-3 shrink-0 opacity-70" style={{ color: "var(--accent)" }} />
        <span>{durationLabel}</span>
      </span>

      {/* 3. Soil Health Effect Badge */}
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border shadow-3xs transition-colors"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
        title={language === "bn" ? "মাটির স্বাস্থ্যের ওপর প্রভাব" : "Effect on soil health"}
      >
        <Sprout className="w-3 h-3 shrink-0" style={{ color: soilColor }} />
        <span style={{ color: soilColor === "var(--risk-safe)" ? "var(--risk-safe)" : "inherit" }}>
          {soilLabel}
        </span>
      </span>
    </div>
  );
}
