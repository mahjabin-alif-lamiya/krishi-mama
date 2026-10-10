"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import SectionHeader from "@/components/ui/SectionHeader";
import ProblemCard from "@/components/cards/ProblemCard";
import StepCard from "@/components/cards/StepCard";
import { buildFarmerSentence } from "@/lib/sentences";
import { formatNumber } from "@/lib/formatNumber";
import {
  CloudRain,
  ArrowRight,
  Clock,
  Droplet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  // State for Real NASA Data Comparison Section
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRealData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/handoff?district=chattogram&rotation=aman-mustard");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Failed to fetch NASA data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  return (
    <div className="flex-1 w-full">
      {/* 1. HERO SECTION (Always-dark surface, DiaSongi inspired) */}
      <section className="surface-dark w-full pt-16 sm:pt-20 lg:pt-28 pb-0 text-center relative transition-colors">
        <div className="surface-pattern" />
        <div className="surface-glow" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Centered Heading with second part in gold */}
          <h1
            className={`font-semibold tracking-tight mx-auto ${
              language === "bn"
                ? "text-2xl sm:text-3xl lg:text-4xl leading-tight max-w-2xl"
                : "text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-3xl"
            }`}
            style={{ color: "#F5FAF6" }}
          >
            {t("home.heroTitlePart1")}{" "}
            <span style={{ color: "var(--accent)" }}>
              {t("home.heroTitlePart2")}
            </span>
          </h1>

          {/* Subtitle in muted light color, max-width ~36rem */}
          <p
            className="text-base sm:text-lg leading-relaxed max-w-[36rem] mx-auto font-normal"
            style={{ color: "var(--muted)" }}
          >
            {t("home.heroSubtitle")}
          </p>

          {/* Two Buttons: Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link href="/planner">
              <button
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: "#E5B84A",
                  color: "#0B3A22",
                }}
              >
                <span>{t("home.ctaPlanner")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/data">
              <button
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-sm sm:text-base font-medium border shadow-2xs hover:bg-white/5 transition-all cursor-pointer"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                  color: "#F5FAF6",
                }}
              >
                <span>{t("home.ctaData")}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Rice-field style decorative curved wave blending into next section */}
        <div className="w-full overflow-hidden leading-none mt-12 sm:mt-16 lg:mt-20 -mb-px relative z-10">
          <svg
            className="relative block w-full h-10 sm:h-16 lg:h-20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,0 C180,70 380,95 600,50 C820,5 1020,75 1200,30 L1200,120 L0,120 Z"
              style={{ fill: "var(--background)" }}
            />
          </svg>
        </div>
      </section>

      {/* 2. PROBLEM CARDS SECTION (Light - Theme Background) */}
      <section
        className="w-full py-16 sm:py-24 transition-colors"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge={t("home.problemsChip")}
            title={t("home.problemsSectionTitle")}
            subtitle={t("home.problemsSectionSubtitle")}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Blue tint for waterlogging */}
            <ProblemCard
              icon={CloudRain}
              iconBg="rgba(59, 130, 246, 0.12)"
              iconColor="#2563EB"
              title={t("home.problem1Title")}
              description={t("home.problem1Desc")}
            />
            {/* Card 2: Amber tint for drying soil */}
            <ProblemCard
              icon={Droplet}
              iconBg="rgba(245, 158, 11, 0.12)"
              iconColor="#D97706"
              title={t("home.problem2Title")}
              description={t("home.problem2Desc")}
            />
            {/* Card 3: Green tint for shorter growing time */}
            <ProblemCard
              icon={Clock}
              iconBg="rgba(34, 197, 94, 0.12)"
              iconColor="#16A34A"
              title={t("home.problem3Title")}
              description={t("home.problem3Desc")}
            />
          </div>
        </div>
      </section>

      {/* 3. STEP CARDS SECTION (How It Works - Surface Dark) */}
      <section className="surface-dark w-full py-16 sm:py-24 transition-colors relative">
        <div className="surface-pattern" />
        <div className="surface-glow" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge={t("home.stepsChip")}
            title={t("home.stepsSectionTitle")}
            subtitle={t("home.stepsSectionSubtitle")}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <StepCard
              stepNumber={1}
              title={t("home.step1Title")}
              description={t("home.step1Desc")}
            />
            <StepCard
              stepNumber={2}
              title={t("home.step2Title")}
              description={t("home.step2Desc")}
            />
            <StepCard
              stepNumber={3}
              title={t("home.step3Title")}
              description={t("home.step3Desc")}
            />
          </div>
        </div>
      </section>

      {/* 4. RISK COMPARISON SECTION (Light-Cream - Theme Background with Real NASA Data) */}
      <section
        className="w-full py-16 sm:py-24 transition-colors"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              badge={t("home.previewChip")}
              title={t("home.previewTitle")}
              subtitle={t("home.previewSubtitle")}
            />

            {/* Live / Snapshot Source Indicator Badge */}
            {data && (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-2xs self-start sm:self-auto"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: data.source === "live" ? "var(--risk-safe)" : "var(--accent)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor:
                      data.source === "live" ? "var(--risk-safe)" : "var(--accent)",
                  }}
                />
                <span>
                  {data.source === "live"
                    ? t("home.liveBadge")
                    : t("home.snapshotBadge")}
                </span>
              </div>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
              {[0, 7, 14].map((d) => (
                <div
                  key={d}
                  className="p-6 sm:p-7 rounded-2xl border shadow-sm space-y-5"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-10 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div className="h-12 w-full rounded bg-neutral-200 dark:bg-neutral-800 pt-3" />
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div
              className="p-8 rounded-2xl border text-center space-y-4 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--risk-danger)",
              }}
            >
              <AlertTriangle
                className="w-10 h-10 mx-auto"
                style={{ color: "var(--risk-danger)" }}
              />
              <p
                className="text-sm font-semibold max-w-md mx-auto"
                style={{ color: "var(--text)" }}
              >
                {t("home.previewError")}
              </p>
              <button
                onClick={fetchRealData}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("home.previewRetry")}</span>
              </button>
            </div>
          )}

          {/* Real Data 3-Card Grid */}
          {!loading && !error && data && data.results && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {data.results.map((res) => {
                  const isSafest = res.delay === data.safestDelay;

                  // Label for delay
                  const delayLabel =
                    res.delay === 0
                      ? t("home.day0Label")
                      : res.delay === 7
                      ? t("home.day7Label")
                      : t("home.day14Label");

                  // Risk color based on calculated level
                  const riskColor =
                    res.level === "safe"
                      ? "var(--risk-safe)"
                      : res.level === "caution"
                      ? "var(--risk-caution)"
                      : "var(--risk-danger)";

                  // Build ONE plain-language farmer sentence from actual NASA calculation
                  const sentenceObj = buildFarmerSentence({
                    delay: res.delay,
                    wetYears: res.wetYears || 0,
                    dryYears: res.dryYears || 0,
                    flaggedYears: res.flaggedYears,
                    yearsUsed: data.yearsUsed || 25,
                    riskPercent: res.riskPercent,
                    level: res.level,
                  });
                  const sentence = sentenceObj[language] || sentenceObj.en;

                  return (
                    <div
                      key={res.delay}
                      className={`p-6 sm:p-7 rounded-2xl border shadow-sm space-y-5 transition-all ${
                        isSafest ? "ring-2 ring-emerald-500/40" : ""
                      }`}
                      style={{
                        backgroundColor: "var(--card)",
                        borderColor: isSafest ? "var(--risk-safe)" : "var(--border)",
                      }}
                    >
                      {/* Top Row: Delay Title & Optional Safest Highlight Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: "var(--text)" }}
                        >
                          {delayLabel}
                        </span>

                        {isSafest && (
                          <span
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: "rgba(22, 163, 74, 0.15)",
                              color: "var(--risk-safe)",
                            }}
                          >
                            {t("home.safestBadge")}
                          </span>
                        )}
                      </div>

                      {/* Percentage & Colored Bar */}
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span
                            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
                            style={{ color: riskColor }}
                          >
                            {formatNumber(res.riskPercent, language)}%
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--muted)" }}
                          >
                            {t("home.riskLabel")}
                          </span>
                        </div>

                        {/* Visual Risk Indicator Bar */}
                        <div
                          className="w-full h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: "var(--background)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(res.riskPercent, 4)}%`,
                              backgroundColor: riskColor,
                            }}
                          />
                        </div>
                      </div>

                      {/* Icon + One Sentence Built via sentences.js */}
                      <div
                        className="pt-3 border-t flex items-start gap-2.5"
                        style={{ borderColor: "var(--border)" }}
                      >
                        {isSafest ? (
                          <CheckCircle2
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: "var(--risk-safe)" }}
                          />
                        ) : res.level === "caution" ? (
                          <AlertTriangle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: "var(--risk-caution)" }}
                          />
                        ) : (
                          <Clock
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: "var(--primary)" }}
                          />
                        )}
                        <p
                          className="text-xs sm:text-sm leading-relaxed"
                          style={{ color: "var(--muted)" }}
                        >
                          {sentence}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Context Banner: Location, Rotation, One Small Disclaimer, Button to /planner */}
              <div
                className="p-5 sm:p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="space-y-1.5">
                  <div
                    className="font-semibold text-sm sm:text-base flex items-center gap-2"
                    style={{ color: "var(--text)" }}
                  >
                    <span>
                      {language === "bn"
                        ? data.districtName?.bn || "চট্টগ্রাম"
                        : data.districtName?.en || "Chattogram"}
                    </span>
                    <span className="opacity-40">•</span>
                    <span>{t("home.previewRotation")}</span>
                  </div>

                  <p
                    className="text-xs sm:text-sm leading-relaxed max-w-2xl"
                    style={{ color: "var(--muted)" }}
                  >
                    {t("home.previewDisclaimer")}
                  </p>
                </div>

                <Link href="/planner" className="shrink-0">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: theme === "light" ? "#FFFFFF" : "#0A0A0A",
                    }}
                  >
                    <span>{t("home.previewCtaButton")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. FINAL CALL-TO-ACTION SECTION (Surface Dark) */}
      <section className="surface-dark w-full py-16 sm:py-24 transition-colors relative scroll-mt-24">
        <div className="surface-pattern" />
        <div className="surface-glow" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="p-8 sm:p-14 rounded-3xl border text-center space-y-6 shadow-xl transition-all"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <h2
                className={`tracking-tight font-semibold ${
                  language === "bn"
                    ? "text-2xl sm:text-3xl"
                    : "text-2xl sm:text-4xl"
                }`}
                style={{ color: "var(--text)" }}
              >
                {t("home.finalCtaTitle")}
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {t("home.finalCtaSubtitle")}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link href="/planner">
                <button
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  style={{
                    backgroundColor: "#E5B84A",
                    color: "#0B3A22",
                  }}
                >
                  <span>{t("home.finalCtaButton")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
