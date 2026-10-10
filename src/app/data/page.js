"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeader from "@/components/ui/SectionHeader";
import DataSourceCard from "@/components/cards/DataSourceCard";
import StatCard from "@/components/cards/StatCard";
import CropTraitBadge from "@/components/cards/CropTraitBadge";
import { ROTATIONS } from "@/lib/crops";
import { SOIL_TYPES } from "@/lib/soils";
import {
  Database,
  ExternalLink,
  MapPin,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  ArrowUpRight,
  Radio,
  Sprout,
  Droplets,
  Clock,
  Sliders,
  Scale,
  Building2,
  Info,
  Satellite,
} from "lucide-react";

export default function DataPage() {
  const { t, language } = useLanguage();

  // Live status panel state
  const [apiStatus, setApiStatus] = useState({
    loading: true,
    source: null,
    latency: null,
    error: null,
  });

  useEffect(() => {
    const checkLiveEndpoint = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch("/api/handoff?district=chattogram&rotation=aman-mustard");
        const elapsed = Date.now() - startTime;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApiStatus({
          loading: false,
          source: data.source || "unknown",
          latency: `${elapsed} ms`,
          error: null,
        });
      } catch (err) {
        setApiStatus({
          loading: false,
          source: null,
          latency: null,
          error: err.message,
        });
      }
    };

    checkLiveEndpoint();
  }, []);

  const verificationInstitutions = [
    {
      code: "BRRI",
      name: language === "bn" ? "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট" : "Bangladesh Rice Research Institute",
      role: language === "bn" ? "আমন ধান কর্তন ও রবি ফসল ক্যালেন্ডার যাচাই" : "Aman harvest schedules & winter crop calendar calibration",
    },
    {
      code: "DAE",
      name: language === "bn" ? "কৃষি সম্প্রসারণ অধিদপ্তর" : "Department of Agricultural Extension",
      role: language === "bn" ? "উপজেলা ও ব্লক পর্যায়ে মাঠপর্যায়ের পরামর্শ ও পর্যবেক্ষণ" : "Upazila and block-level extension practice & field advisories",
    },
    {
      code: "BARC",
      name: language === "bn" ? "বাংলাদেশ কৃষি গবেষণা কাউন্সিল" : "Bangladesh Agricultural Research Council",
      role: language === "bn" ? "কৃষি-বাস্তুতান্ত্রিক অঞ্চল (AEZ) উপাত্ত ও সমন্বিত মূল্যায়ন" : "Agro-Ecological Zones (AEZ) data & national agronomic benchmarks",
    },
    {
      code: "SRDI",
      name: language === "bn" ? "মৃত্তিকা সম্পদ উন্নয়ন ইনস্টিটিউট" : "Soil Resource Development Institute",
      role: language === "bn" ? "মাটির বুনট, সিরিজ মানচিত্র ও আর্দ্রতা নিষ্কাশন হার" : "Soil texture series, percolation rates & moisture retention curves",
    },
    {
      code: "BARI",
      name: language === "bn" ? "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট" : "Bangladesh Agricultural Research Institute",
      role: language === "bn" ? "সরিষা ও মসুর ডাল জাতের পানির চাহিদা ও জলবায়ু সহনশীলতা" : "Oilseed & pulse physiological water requirements & heat tolerance",
    },
    {
      code: "BWMRI",
      name: language === "bn" ? "বাংলাদেশ গম ও ভুট্টা গবেষণা ইনস্টিটিউট" : "Bangladesh Wheat and Maize Research Institute",
      role: language === "bn" ? "গমের পরাগায়ন ও দানা গঠনের সময় প্রান্তিক তাপমাত্রা সহনশীলতা" : "Wheat terminal heat stress thresholds during grain filling",
    },
  ];

  const futureWorkItems = [
    { title: "NASA SMAP", desc: t("data.futureSMAP") },
    { title: "GPM IMERG", desc: t("data.futureGPM") },
    { title: "64 Districts", desc: t("data.futureDistricts") },
    { title: "Expanded Rotations", desc: t("data.futureCrops") },
    { title: "IVR & Voice Alerts", desc: t("data.futureAudioSMS") },
    { title: "BAMIS API Sync", desc: t("data.futureBAMIS") },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Page Header */}
      <div className="space-y-4">
        <SectionHeader
          badge={t("nav.data")}
          title={t("data.dataTitle")}
          subtitle={t("data.dataSubtitle")}
        />
      </div>

      {/* AT A GLANCE ROW */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {t("data.glanceTitle")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            value="25"
            unit={language === "bn" ? "বছর" : "Years"}
            label={t("data.glanceYears")}
            subtext={t("data.glanceYearsDesc")}
          />
          <StatCard
            value="64"
            unit={language === "bn" ? "জেলা" : "Districts"}
            label={t("data.glanceDistricts")}
            subtext={t("data.glanceDistrictsDesc")}
          />
          <StatCard
            value="3"
            unit={language === "bn" ? "ফসল চক্র" : "Rotations"}
            label={t("data.glanceRotations")}
            subtext={t("data.glanceRotationsDesc")}
          />
        </div>
      </section>

      {/* 1. LIVE API STATUS PANEL */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {t("data.liveStatusTitle")}
        </h3>

        <div
          className="p-5 sm:p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs shrink-0"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: apiStatus.source === "live" ? "var(--risk-safe)" : "var(--accent)",
              }}
            >
              <Radio className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                  {apiStatus.loading
                    ? t("common.loading")
                    : apiStatus.source === "live"
                    ? t("data.liveStatusConnected")
                    : t("data.liveStatusSnapshot")}
                </span>
                {apiStatus.source && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor:
                        apiStatus.source === "live" ? "var(--risk-safe)" : "var(--accent)",
                      color: "#FFFFFF",
                    }}
                  >
                    {apiStatus.source}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                Endpoint: <code>/api/handoff?district=chattogram&rotation=aman-mustard</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {apiStatus.latency && (
              <span
                className="px-3 py-1 rounded-lg border"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                }}
              >
                Response: <strong>{apiStatus.latency}</strong>
              </span>
            )}
            <a
              href="https://power.larc.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1 font-sans font-bold"
              style={{ color: "var(--primary)" }}
            >
              <span>NASA Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY DATA SOURCE & TECHNICAL VARIABLES */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {t("data.variablesSectionTitle")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DataSourceCard
            datasetName="NASA POWER Daily Meteorology"
            link="https://power.larc.nasa.gov/"
            variables={["PRECTOTCORR", "T2M", "GWETROOT"]}
            coverage="Chattogram (22.34°N, 91.83°E) & Cumilla (23.46°N, 91.18°E)"
            note="Daily continuous data from 2001-01-01 to 2025-12-31 (~9,131 days). Format: JSON Point API."
          />

          <div
            className="p-6 rounded-2xl border shadow-sm space-y-4"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--primary)",
                }}
              >
                PRECTOTCORR
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                Precipitation
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {t("data.varPrectotcorrDesc")}
            </p>
            <div
              className="pt-2 border-t text-[11px] font-mono"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              Unit: mm/day • Source: MERRA-2
            </div>
          </div>

          <div
            className="p-6 rounded-2xl border shadow-sm space-y-4"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--primary)",
                }}
              >
                GWETROOT
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                Root Zone Wetness
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {t("data.varGwetrootDesc")}
            </p>
            <div
              className="pt-2 border-t text-[11px] font-mono"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              Unit: 0.0 - 1.0 (fractional) • Source: GEOS AG
            </div>
          </div>
        </div>
      </section>

      {/* 3. DATA FUSION: NASA EARTH OBSERVATIONS VS. LOCAL INFORMATION */}
      <section
        className="p-6 sm:p-10 rounded-2xl border shadow-sm space-y-8"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <SectionHeader
          badge={language === "bn" ? "উপাত্ত সমন্বয়" : "Data Fusion"}
          title={t("data.dataFusionHeading")}
          subtitle={t("data.dataFusionSubtitle")}
        />

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column A: NASA Earth Observations */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between space-y-5"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--primary)",
                  }}
                >
                  <Satellite className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>
                    {t("data.nasaDataColumnTitle")}
                  </h4>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {language === "bn"
                      ? "নাসা ল্যাংলি রিসার্চ সেন্টার (POWER প্রকল্প)"
                      : "NASA Langley Research Center (POWER Project)"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>PRECTOTCORR:</strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "২৫ বছরের দৈনিক সংশোধিত বৃষ্টিপাত (মিমি/দিন) — MERRA-2 মডেল।"
                        : "25-year daily corrected precipitation (mm/day) from MERRA-2."}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>T2M (Air Temperature):</strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "২ মিটার উচ্চতায় দৈনিক গড় তাপমাত্রা (°C) — শীতকালীন প্রান্তিক তাপদাহ নিরীক্ষা।"
                        : "Daily 2-meter air temperature (°C) tracking terminal heat periods (>32°C)."}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>GWETROOT:</strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "মূল অঞ্চলের মাটির আর্দ্রতা অনুপাত (০.০ - ১.০) — GEOS AG ভূ-পৃষ্ঠ মডেল।"
                        : "Root zone soil wetness fraction (0.0 to 1.0) from GEOS AG land surface models."}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>
                      {language === "bn" ? "স্থানিক ও সময়ভিত্তিক পরিধি:" : "Spatial & Temporal Grid:"}
                    </strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "৬৪ জেলার ভৌগোলিক কেন্দ্রবিন্দু (~৫০ কিমি গ্রিড) এবং ২০০১-২০২৫ (৯,১৩১ দিন)।"
                        : "~0.5° × 0.5° (~50 km) representative grid centroids across all 64 districts; 2001–2025."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-3 rounded-xl border text-[11px] font-medium"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--primary)",
              }}
            >
              {language === "bn"
                ? "বৈশিষ্ট্য: সম্পূর্ণ নৈর্ব্যক্তিক ও ঐতিহাসিক উপগ্রহ পর্যবেক্ষণ যা অতীত জলবায়ু ঝুঁকি নিরূপণ করে।"
                : "Role: Objective 25-year observational climatology providing empirical frequencies of severe events."}
            </div>
          </div>

          {/* Column B: Local Agronomic Context */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between space-y-5"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>
                    {t("data.localInfoColumnTitle")}
                  </h4>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {language === "bn"
                      ? "কৃষকের মাঠপর্যায়ের ইনপুট ও স্থানীয় কৃষিতাত্ত্বিক পরামিতি"
                      : "Farmer Field Inputs & Local Agronomic Parameters"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <Layers className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>
                      {language === "bn" ? "মাটির বুনট (Soil Texture):" : "Topsoil Texture Class:"}
                    </strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "দোআঁশ, এঁটেল, বা বেলে মাটি — পানি নিষ্কাশন গতি এবং জলাবদ্ধতার সহনশীলতা পরিবর্তন করে।"
                        : "Loam, Clay, or Sandy soil — dynamically shifts wet/dry drainage thresholds by ±5 mm / ±0.05 GWET."}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <Clock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>
                      {language === "bn" ? "ফসল চক্রের সময়কাল ও বৈশিষ্ট্য:" : "Crop Cycle & Trait Physiology:"}
                    </strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "ফসল বৃদ্ধির দিন (৮৫-১১০ দিন), পানির চাহিদা (কম/মাঝারি), এবং ডাল জাতীয় নাইট্রোজেন সংযোজন।"
                        : "Crop duration (85–110 days), water demand (low/medium), and legume nitrogen fixation."}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <Calendar className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>
                      {language === "bn" ? "রোপণ ক্যালেন্ডার ও প্রতিষ্ঠা উইন্ডো:" : "Sowing Calendar & Window:"}
                    </strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "আমন কর্তনের পর লক্ষ্যমাত্রা তারিখ (১০, ১৫, ২২ নভেম্বর) এবং চারা গজানোর ১৪ দিনের প্রতিষ্ঠা পর্ব।"
                        : "Target post-monsoon sowing dates (Nov 10, 15, 22) + 14-day germination establishment window."}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <Sliders className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong style={{ color: "var(--text)" }}>
                      {language === "bn" ? "কৃষকের অগ্রাধিকারসমূহ (Priorities):" : "Farmer Decision Goals:"}
                    </strong>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {language === "bn"
                        ? "সর্বনিম্ন জলবায়ু ঝুঁকি, পানি সাশ্রয়, বা মাটির স্বাস্থ্য সুরক্ষা — স্বচ্ছ ওজনের ভিত্তিতে সিদ্ধান্ত।"
                        : "Lowest Climate Risk, Save Water, or Protect Soil — rule-based multi-criteria trade-offs."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-3 rounded-xl border text-[11px] font-medium"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--accent)",
              }}
            >
              {language === "bn"
                ? "বৈশিষ্ট্য: স্থানীয় কৃষিতাত্ত্বিক প্রেক্ষাপট যা উপগ্রহ উপাত্তের ঝুঁকিকে ব্যবহারিক সিদ্ধান্তে রূপান্তরিত করে।"
                : "Role: Local agronomic context that personalizes satellite climate hazards into actionable farm choices."}
            </div>
          </div>
        </div>

        {/* Synthesis Banner: How Fusion Works */}
        <div
          className="p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center gap-5 shadow-2xs"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--primary)",
            }}
          >
            <Scale className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>
              {t("data.fusionSynthesisTitle")}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {t("data.fusionSynthesisDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* 4. LOCAL INFORMATION & AGRONOMIC ASSUMPTIONS (NOT NASA DATA) */}
      <section className="space-y-8">
        <div className="space-y-4">
          <SectionHeader
            badge={language === "bn" ? "স্থানীয় তথ্য ও অনুমান" : "Local Information"}
            title={t("data.localInfoHeading")}
            subtitle={t("data.localInfoSubtitle")}
          />

          {/* Loud Warning Banner */}
          <div
            className="p-5 rounded-2xl border text-xs flex items-start gap-3 shadow-2xs"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--risk-caution)",
              color: "var(--text)",
            }}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
            <div className="space-y-1">
              <strong className="block text-sm">
                {language === "bn"
                  ? "গুরুত্বপূর্ণ কৃষিতাত্ত্বিক সতর্কবার্তা ও অনুমান নীতিমালা"
                  : "Critical Agronomic Notice & Assumption Protocol"}
              </strong>
              <p className="leading-relaxed font-medium" style={{ color: "var(--muted)" }}>
                {t("data.assumptionsWarning")}
              </p>
            </div>
          </div>
        </div>

        {/* 4A. SOIL DRAINAGE & RETENTION ASSUMPTIONS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: "var(--primary)" }} />
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
              {t("data.soilAssumptionsTitle")}
            </h3>
          </div>

          <div
            className="rounded-2xl border overflow-x-auto shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.soilColumnTexture")}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.soilColumnDrainage")}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.soilColumnDescription")}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.soilColumnSource")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(SOIL_TYPES).map((soil, idx) => (
                  <tr
                    key={soil.id}
                    className={`border-b last:border-0 ${idx % 2 === 1 ? "bg-[var(--background)]" : ""}`}
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="p-4 font-bold" style={{ color: "var(--text)" }}>
                      {soil.name[language] || soil.name.en}
                    </td>
                    <td className="p-4 font-mono font-bold" style={{ color: "var(--primary)" }}>
                      {soil.drainageModifier.label[language] || soil.drainageModifier.label.en}
                    </td>
                    <td className="p-4 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {soil.description[language] || soil.description.en}
                    </td>
                    <td className="p-4 font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                      {soil.sourceNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4B. CROP CHARACTERISTIC ASSUMPTIONS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4" style={{ color: "var(--primary)" }} />
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
              {t("data.cropAssumptionsTitle")}
            </h3>
          </div>

          <div
            className="rounded-2xl border overflow-x-auto shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.cropColumnCrop")}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.cropColumnWater")}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.cropColumnDuration")}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.cropColumnSoilEffect")}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {language === "bn" ? "প্রারম্ভিক থ্রেশহোল্ড" : "Baseline Thresholds"}
                  </th>
                  <th className="p-4 font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {t("data.cropColumnSource")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(ROTATIONS).map((rot, idx) => (
                  <tr
                    key={rot.id}
                    className={`border-b last:border-0 ${idx % 2 === 1 ? "bg-[var(--background)]" : ""}`}
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="p-4" style={{ color: "var(--text)" }}>
                      <div className="font-bold">{rot.name[language] || rot.name.en}</div>
                      <div className="text-[11px] font-normal" style={{ color: "var(--muted)" }}>
                        {rot.cropName[language] || rot.cropName.en}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor:
                            rot.waterNeed === "low"
                              ? "rgba(22, 163, 74, 0.15)"
                              : "rgba(200, 150, 30, 0.15)",
                          color: rot.waterNeed === "low" ? "var(--risk-safe)" : "var(--accent)",
                        }}
                      >
                        {rot.waterNeed}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold" style={{ color: "var(--text)" }}>
                      {rot.durationDays} {t("common.days")}
                    </td>
                    <td className="p-4 font-semibold" style={{ color: "var(--text)" }}>
                      {rot.isLegume ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {language === "bn" ? "নাইট্রোজেন বৃদ্ধি করে (লেগিউম)" : "Builds Nitrogen (Legume)"}
                        </span>
                      ) : rot.soilHealthEffect === "neutral" ? (
                        <span style={{ color: "var(--muted)" }}>
                          {language === "bn" ? "নিরপেক্ষ প্রভাব" : "Neutral Effect"}
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">
                          {language === "bn" ? "পুষ্টি শোষণ করে" : "Depletes Nutrients"}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[11px]" style={{ color: "var(--text)" }}>
                      <div>Wet: &gt; {rot.wetRainThresholdMm} mm</div>
                      <div style={{ color: "var(--muted)" }}>Dry: &lt; {rot.dryWetnessThreshold} GWET</div>
                    </td>
                    <td className="p-4 font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                      {rot.sourceNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4C. INSTITUTIONS FOR GROUND VERIFICATION */}
        <div
          className="p-6 sm:p-8 rounded-2xl border shadow-sm space-y-6"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
              {t("data.sourcesToVerify")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verificationInstitutions.map((inst) => (
              <div
                key={inst.code}
                className="p-4 rounded-xl border flex flex-col justify-between space-y-2"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded font-mono text-xs font-bold"
                      style={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--primary)",
                      }}
                    >
                      {inst.code}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold mt-2" style={{ color: "var(--text)" }}>
                    {inst.name}
                  </h5>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {inst.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STEP-BY-STEP CALCULATION METHODOLOGY */}
      <section
        className="p-6 sm:p-10 rounded-2xl border shadow-sm space-y-6"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <SectionHeader
          badge={language === "bn" ? "অ্যালগরিদম" : "Algorithm"}
          title={t("data.methodologyHeading")}
          subtitle={t("data.methodologyDesc")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div
            className="p-4 rounded-xl border"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
          >
            <p style={{ color: "var(--text)" }}>{t("data.methodStep1")}</p>
          </div>
          <div
            className="p-4 rounded-xl border"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
          >
            <p style={{ color: "var(--text)" }}>{t("data.methodStep2")}</p>
          </div>
          <div
            className="p-4 rounded-xl border"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
          >
            <p style={{ color: "var(--text)" }}>{t("data.methodStep3")}</p>
          </div>
          <div
            className="p-4 rounded-xl border"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
          >
            <p style={{ color: "var(--text)" }}>{t("data.methodStep4")}</p>
          </div>
        </div>
      </section>

      {/* 6. SCIENTIFIC LIMITATIONS */}
      <section className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
          {t("data.limitationsHeading")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-2xl border shadow-sm space-y-3"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>
              Historical Climatology
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {t("data.limitation1")}
            </p>
          </div>

          <div
            className="p-6 rounded-2xl border shadow-sm space-y-3"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>
              ~50 km Spatial Grid
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {t("data.limitation2")}
            </p>
          </div>

          <div
            className="p-6 rounded-2xl border shadow-sm space-y-3"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>
              Modeled Soil Wetness
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {t("data.limitation3")}
            </p>
          </div>
        </div>
      </section>

      {/* 7. FUTURE WORK & SCALING ROADMAP */}
      <section
        className="p-6 sm:p-10 rounded-2xl border shadow-sm space-y-6"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <SectionHeader
          badge={language === "bn" ? "রোডম্যাপ" : "Roadmap"}
          title={t("data.futureWorkHeading")}
          subtitle="NASA Earth Observations Integration Expansion Pipeline"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {futureWorkItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border flex flex-col justify-between space-y-2"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                <strong style={{ color: "var(--text)" }}>{item.title}</strong>
              </div>
              <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
