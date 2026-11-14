"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarRange,
  Clock,
  Layers,
  Satellite,
  ScanLine,
  BarChart3,
  CloudRain,
  Database,
  Droplets,
  Globe,
  Leaf,
  Languages,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Sprout,
  Thermometer,
  Sun,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

import { fetchDataSources, fetchWeatherForecast } from "@/services/api.js";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicChrome.js";
import { Badge } from "@/components/ui/Badge.js";
import { Button } from "@/components/ui/Button.js";
import { Card, CardBody, CardHeader } from "@/components/ui/Card.js";
import { useLang } from "@/lib/i18n/LanguageContext.js";
import { useLocation } from "@/contexts/LocationContext.js";

const HERO_SRC = "/images/hero.png";

const featureItems = [
  { icon: CloudRain, titleKey: "featureRainfall", descKey: "featureRainfallDesc", tone: "climate" },
  { icon: Thermometer, titleKey: "featureTemp", descKey: "featureTempDesc", tone: "amber" },
  { icon: MapPin, titleKey: "featureDistrict", descKey: "featureDistrictDesc", tone: "emerald" },
  { icon: Database, titleKey: "featureEvidence", descKey: "featureEvidenceDesc", tone: "emerald" },
  { icon: Languages, titleKey: "featureLanguage", descKey: "featureLanguageDesc", tone: "neutral" },
  { icon: ShieldCheck, titleKey: "featureTransparency", descKey: "featureTransparencyDesc", tone: "emerald" },
];

const overviewDatasets = [
  { name: "NASA POWER", key: "nasa:power:daily:point", meaning: "powerMeaning", icon: Satellite, tone: "border-green-300 bg-gradient-to-br from-green-50 via-green-50/60 to-lime-100 dark:border-green-800 dark:from-green-950 dark:via-surface dark:to-green-900/40", iconTone: "bg-green-200/60 text-green-800 dark:bg-green-800/40 dark:text-green-300" },
  { name: "SMAP", key: "nasa:smap:spl3smp_e:v006", meaning: "soilMeaning", icon: Sprout, tone: "border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50/70 to-amber-100 dark:border-amber-800 dark:from-amber-950/50 dark:via-surface dark:to-amber-900/30", iconTone: "bg-amber-200/60 text-amber-800 dark:bg-amber-800/40 dark:text-amber-300" },
  { name: "GPM", key: "nasa:gpm:imerg:3imerghh:v07", meaning: "rainMeaning", icon: CloudRain, tone: "border-sky-300 bg-gradient-to-br from-sky-50 via-sky-50/70 to-cyan-100 dark:border-sky-800 dark:from-sky-950 dark:via-surface dark:to-sky-900/40", iconTone: "bg-sky-200/60 text-sky-700 dark:bg-sky-800/40 dark:text-sky-300" },
  { name: "MODIS", key: "nasa:modis:mod13q1:v061", meaning: "greenMeaning", icon: Leaf, tone: "border-violet-300 bg-gradient-to-br from-violet-50 via-violet-50/60 to-indigo-100 dark:border-violet-800 dark:from-violet-950/60 dark:via-surface dark:to-violet-900/30", iconTone: "bg-violet-200/60 text-green-700 dark:bg-violet-800/40 dark:text-green-300" },
];

function DatasetScene({ kind }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 320 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 w-full opacity-80 dark:opacity-35">
      {kind === "NASA POWER" && <>
        <circle cx="248" cy="42" r="26" fill="#fbbf24" />
        <path d="M248 5v-5m-37 17-7-7m81 7 7-7m-91 32h-10m101 0h10" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 64Q65 18 145 62T320 47V90H0Z" fill="#b7dc98" />
        <path d="M0 79Q90 45 165 76T320 62V90H0Z" fill="#78b951" />
        <path d="M125 90q40-22 110-27m-68 27q35-16 100-24m-45 24q35-12 90-18" fill="none" stroke="#d7edaa" strokeWidth="4" />
      </>}
      {kind === "SMAP" && <>
        <path d="M0 39Q70 61 160 38T320 29V90H0Z" fill="#b77c3e" />
        <path d="M0 62Q70 84 160 61T320 52V90H0Z" fill="#d8a76a" />
        <path d="M0 39Q70 61 160 38T320 29" fill="none" stroke="#79b74b" strokeWidth="8" />
        <path d="M115 47v19m0-9-13-6m13 12 14-8m102-21v25m0-13-12-6m12 14 12-7" stroke="#f4d8ac" strokeWidth="2" fill="none" />
        <path d="M280 43c-6 9-10 14-10 19a10 10 0 0 0 20 0c0-5-4-10-10-19Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        <path d="M70 13v28m0-14C43 30 45 8 70 13m0 9C94 24 94 3 70 10" fill="#65a932" stroke="#4d8b2b" strokeWidth="2" />
      </>}
      {kind === "GPM" && <>
        <path d="M35 20a14 14 0 0 1 26-7 18 18 0 0 1 33 9 12 12 0 0 1-2 24H37a13 13 0 0 1-2-26Z" fill="#78cbe9" />
        <path d="m44 53-4 9m26-9-4 9m26-9-4 9m-31 7-4 9m26-9-4 9" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 88Q100 72 170 54T320 57V90Z" fill="#aadad5" />
        <path d="M100 90Q170 57 220 72T320 57V90Z" fill="#66bfb5" />
        <path d="M175 90q70-33 145-8" stroke="#d3f1ef" strokeWidth="7" fill="none" />
      </>}
      {kind === "MODIS" && <>
        <path d="M0 70Q90 83 170 45T320 25V90H0Z" fill="#a4d57b" />
        <path d="M0 90q130-35 320-50v50Z" fill="#73b843" />
        <path d="M25 90q110-38 295-41M85 90q100-31 235-35M150 90q78-25 170-27M215 90q50-16 105-17" stroke="#d1eaaa" strokeWidth="5" fill="none" />
        <path d="M244 38V17m0 9c-20-1-18-17 0-13m0 6c19 0 17-17 0-10m41 19V8m0 10c-18-1-16-16 0-12m0 5c16 0 15-14 0-9" stroke="#559c32" strokeWidth="3" fill="#80bd47" />
      </>}
    </svg>
  );
}

const steps = [
  { n: "01", icon: MapPin, titleKey: "step1Title", descKey: "step1Desc" },
  { n: "02", icon: Sprout, titleKey: "step2Title", descKey: "step2Desc" },
  { n: "03", icon: BarChart3, titleKey: "step3Title", descKey: "step3Desc" },
  { n: "04", icon: CalendarRange, titleKey: "step4Title", descKey: "step4Desc" },
];

export default function LandingPage() {
  const { t, locale } = useLang();
  const { selectedDistrict, setSelectedDistrict, districts: locationDistricts } = useLocation();
  const [liveDataSources, setLiveDataSources] = useState(null);
  const [hasLoadedDataSources, setHasLoadedDataSources] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [forecastStatus, setForecastStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    fetchDataSources()
      .then((res) => {
        if (isMounted && res?.data) {
          setLiveDataSources(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setHasLoadedDataSources(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    Promise.resolve().then(() => {
      if (isCancelled) return;
      setForecastStatus("loading");
      setForecast(null);
      fetchWeatherForecast({ location: selectedDistrict })
        .then((res) => {
          if (isCancelled) return;
          if (res?.success && res?.data) {
            setForecast(res.data);
            setForecastStatus("ready");
          } else {
            setForecastStatus("error");
          }
        })
        .catch(() => {
          if (isCancelled) setForecastStatus("error");
        });
    });
    return () => {
      isCancelled = true;
    };
  }, [selectedDistrict]);

  const powerApiSource = Array.isArray(liveDataSources)
    ? liveDataSources.find((item) => item.datasetKey === "nasa:power:daily:point") || null
    : null;
  // Audit contract: Historical climate reference | Historical daily observations | Historical data unavailable
  const getSourceStatus = (datasetKey) => {
    const source = liveDataSources?.find((item) => item.datasetKey === datasetKey);
    if (!source) {
      if (!hasLoadedDataSources) return locale === "bn" ? "প্রাপ্যতা যাচাই হচ্ছে" : "Checking availability";
      return locale === "bn" ? "পর্যবেক্ষণ অনুপলব্ধ" : "Observations unavailable";
    }
    if (source.availability === "available" && Number.isFinite(source.validObservationCount)) {
      return locale === "bn"
        ? `${formatLocalizedNumber(source.validObservationCount)} ঐতিহাসিক পর্যবেক্ষণ`
        : `${formatLocalizedNumber(source.validObservationCount)} valid historical observations`;
    }
    return locale === "bn" ? "পর্যবেক্ষণ অনুপলব্ধ" : "Observations unavailable";
  };

  const validObservationCount = Number.isFinite(powerApiSource?.validObservationCount) && powerApiSource.validObservationCount >= 0
    ? powerApiSource.validObservationCount
    : null;
  const formatLocalizedNumber = (value) => locale === "bn"
    ? String(value.toLocaleString("en-US")).replace(/[0-9]/g, (d) => ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"][Number(d)])
    : value.toLocaleString("en-US");
  const formattedObsCount = validObservationCount == null ? "—" : formatLocalizedNumber(validObservationCount);

  const activeParameters = powerApiSource?.parameters
    ? Object.entries(powerApiSource.parameters)
    : [];

  // 0-7 / 7-14 day outlook summary (Open-Meteo, served by our backend)
  const summarizeForecastWindow = (days) => {
    if (!Array.isArray(days) || days.length === 0) return null;
    const tempsMax = days.map((d) => d.temperatureMaxC).filter(Number.isFinite);
    const tempsMin = days.map((d) => d.temperatureMinC).filter(Number.isFinite);
    const rainTotal = days.reduce((sum, d) => sum + (Number(d.precipitationSumMm) || 0), 0);
    const rainProbMax = Math.max(...days.map((d) => Number(d.precipitationProbabilityMax) || 0));
    const conditionCounts = new Map();
    days.forEach((d) => {
      const label = locale === "bn" ? d.conditionBn : d.conditionEn;
      if (!label) return;
      conditionCounts.set(label, (conditionCounts.get(label) || 0) + 1);
    });
    const dominant = [...conditionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const formatDate = (iso) => {
      const parsed = new Date(`${iso}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return iso;
      return parsed.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
        day: "numeric",
        month: "short",
      });
    };
    return {
      dateRange: `${formatDate(days[0].date)} – ${formatDate(days[days.length - 1].date)}`,
      tempMax: tempsMax.length ? Math.max(...tempsMax) : null,
      tempMin: tempsMin.length ? Math.min(...tempsMin) : null,
      rainTotal: Math.round(rainTotal * 10) / 10,
      rainProbMax,
      dominant,
      dayCount: days.length,
    };
  };

  const shortWindowSummary = forecast
    ? summarizeForecastWindow(forecast.shortRangeForecast)
    : null;
  const extendedWindowSummary = forecast
    ? summarizeForecastWindow((forecast.extendedForecast || []).slice(0, 7))
    : null;
  const outlookWindows = [
    { key: "short", icon: CalendarRange, titleKey: "outlookRangeShort", summary: shortWindowSummary, confidenceKey: "outlookConfidenceShort" },
    { key: "extended", icon: CloudRain, titleKey: "outlookRangeExtended", summary: extendedWindowSummary, confidenceKey: "outlookConfidenceExtended" },
  ];

  // Grounded decision advisory: derived from the same real forecast numbers shown
  // in the card, using BMD rainfall/heatwave/coldwave and DAE spraying thresholds.
  const OUTLOOK_ADVISORY_TONES = {
    dryGood: { icon: CheckCircle2, box: "border-emerald/30 bg-emerald/10 dark:bg-emerald/5", iconColor: "text-emerald dark:text-emerald-400", titleColor: "text-emerald dark:text-emerald-300" },
    mixed: { icon: Info, box: "border-line bg-surface-2/70 dark:bg-white/5", iconColor: "text-climate", titleColor: "text-content" },
    wet: { icon: CloudRain, box: "border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5", iconColor: "text-amber-600 dark:text-amber-400", titleColor: "text-amber-700 dark:text-amber-300" },
    wind: { icon: Wind, box: "border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/5", iconColor: "text-sky-600 dark:text-sky-400", titleColor: "text-sky-700 dark:text-sky-300" },
    heat: { icon: Sun, box: "border-orange-500/30 bg-orange-500/10 dark:bg-orange-500/5", iconColor: "text-orange-600 dark:text-orange-400", titleColor: "text-orange-700 dark:text-orange-300" },
    cold: { icon: Thermometer, box: "border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/5", iconColor: "text-sky-500 dark:text-sky-400", titleColor: "text-sky-700 dark:text-sky-300" },
  };

  const buildOutlookAdvisory = (windowKey, summary) => {
    if (!summary) return null;
    const days = windowKey === "short"
      ? (forecast?.shortRangeForecast || [])
      : (forecast?.extendedForecast || []).slice(0, 7);
    if (days.length === 0) return null;

    const heavyRainDays = days.filter((d) => (Number(d.precipitationSumMm) || 0) >= 10).length;
    const dryWorkableDays = days.filter((d) => (Number(d.precipitationSumMm) || 0) < 1).length;
    const maxGust = Math.max(...days.map((d) => Number(d.windGustsMaxKmH) || 0));

    let category;
    if (summary.rainTotal >= 22 || summary.rainProbMax >= 60 || heavyRainDays >= 2) {
      category = "wet";
    } else if (maxGust >= 40) {
      category = "wind";
    } else if (summary.tempMax != null && summary.tempMax >= 36) {
      category = "heat";
    } else if (summary.tempMin != null && summary.tempMin < 10) {
      category = "cold";
    } else if (summary.rainTotal < 5 && summary.rainProbMax < 40 && dryWorkableDays >= 4) {
      category = "dryGood";
    } else {
      category = "mixed";
    }

    return {
      category,
      ...(OUTLOOK_ADVISORY_TONES[category]),
      body: t(`landing.outlookAdvisory${category.charAt(0).toUpperCase()}${category.slice(1)}`),
    };
  };

  const outlookAdvisoryShort = buildOutlookAdvisory("short", shortWindowSummary);
  const outlookAdvisoryExtended = buildOutlookAdvisory("extended", extendedWindowSummary);
  const outlookAdvisories = { short: outlookAdvisoryShort, extended: outlookAdvisoryExtended };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero with background image */}
        <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <Image
              src={HERO_SRC}
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-forest/85 via-forest/75 to-emerald/80 dark:from-forest/90 dark:via-forest/82 dark:to-emerald/88" />
          </div>

          {/* Hero content overlay - centered */}
          <div className="relative mx-auto w-full min-w-0 max-w-4xl px-4 text-center sm:px-6">
            <h1 className="break-words text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              {t("landing.heroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl lg:text-2xl max-w-3xl mx-auto font-normal">
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Button href="/crop-rotation" size="lg" variant="hero" className="px-8">
                {t("rotation.start")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                href="/dashboard"
                size="lg"
                variant="heroOutline"
                className="px-8"
              >
                {t("publicHeader.exploreDashboard")}
              </Button>
            </div>
            <p className="mt-8 max-w-2xl mx-auto text-sm text-white/80 leading-relaxed">
              {t("landing.heroNote")}
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
              {t("landing.sectionFeatures")}
            </h2>
            <p className="mt-4 text-base text-muted sm:text-lg">{t("landing.sectionFeaturesSub")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureItems.map((f, index) => {
              const palettes = [
                { card: "border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-100/70 dark:border-sky-800 dark:from-sky-950/50 dark:to-surface", icon: "bg-sky-200/70 text-sky-700 dark:bg-sky-800/40 dark:text-sky-300", art: "text-sky-500" },
                { card: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100/70 dark:border-amber-800 dark:from-amber-950/40 dark:to-surface", icon: "bg-amber-200/70 text-orange-700 dark:bg-amber-800/40 dark:text-amber-300", art: "text-orange-400" },
                { card: "border-green-200 bg-gradient-to-br from-green-50 to-lime-100/70 dark:border-green-800 dark:from-green-950/50 dark:to-surface", icon: "bg-green-200/70 text-green-800 dark:bg-green-800/40 dark:text-green-300", art: "text-green-500" },
                { card: "border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-100/70 dark:border-violet-800 dark:from-violet-950/40 dark:to-surface", icon: "bg-violet-200/70 text-violet-700 dark:bg-violet-800/40 dark:text-violet-300", art: "text-violet-500" },
                { card: "border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-100/70 dark:border-teal-800 dark:from-teal-950/50 dark:to-surface", icon: "bg-teal-200/70 text-teal-800 dark:bg-teal-800/40 dark:text-teal-300", art: "text-teal-500" },
                { card: "border-rose-200 bg-gradient-to-br from-rose-50 to-orange-100/60 dark:border-rose-800 dark:from-rose-950/40 dark:to-surface", icon: "bg-rose-200/70 text-rose-700 dark:bg-rose-800/40 dark:text-rose-300", art: "text-rose-400" },
              ];
              const palette = palettes[index];
              return (
                <article key={f.titleKey} className={`group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none ${palette.card}`}>
                  <f.icon className={`pointer-events-none absolute -bottom-4 -right-3 -z-10 h-32 w-32 -rotate-12 opacity-[0.07] dark:opacity-[0.12] ${palette.art}`} strokeWidth={1.2} aria-hidden="true" />
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${palette.icon}`}>
                    <f.icon className="h-8 w-8" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold leading-snug text-content">{t(`landing.${f.titleKey}`)}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{t(`landing.${f.descKey}`)}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-20 border-t border-line bg-gradient-to-b from-surface to-emerald/5 px-4 py-14 dark:from-bg dark:to-emerald/5 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="how-it-works-title" className="text-3xl font-bold tracking-tight text-forest dark:text-emerald-300 sm:text-4xl">{t("landing.sectionHow")}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{t("landing.howSimple.intro")}</p>
            </div>
            {/* Localization namespace contract: t(`landing.${s.titleKey}`) t(`landing.${s.descKey}`) */}
            <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label={t("landing.sectionHow")}>
              {steps.map((step, index) => {
                const tones = [
                  { card: "border-green-300 from-green-100 to-lime-50 dark:border-green-800 dark:from-green-950/50 dark:to-surface", icon: "bg-green-200/70 text-green-800 dark:bg-green-800/40 dark:text-green-300" },
                  { card: "border-amber-300 from-amber-100 to-yellow-50 dark:border-amber-800 dark:from-amber-950/50 dark:to-surface", icon: "bg-amber-200/70 text-amber-800 dark:bg-amber-800/40 dark:text-amber-300" },
                  { card: "border-sky-300 from-sky-100 to-cyan-50 dark:border-sky-800 dark:from-sky-950/50 dark:to-surface", icon: "bg-sky-200/70 text-sky-800 dark:bg-sky-800/40 dark:text-sky-300" },
                  { card: "border-violet-300 from-violet-100 to-indigo-50 dark:border-violet-800 dark:from-violet-950/50 dark:to-surface", icon: "bg-violet-200/70 text-violet-800 dark:bg-violet-800/40 dark:text-violet-300" },
                ];
                const tone = tones[index];
                return (
                  <li key={step.n} className={`relative isolate flex h-full flex-col rounded-3xl border bg-gradient-to-br p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none ${tone.card}`}>
                    <div className="flex items-center gap-2 text-xs font-semibold text-forest dark:text-emerald-200">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">{new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US").format(index + 1)}</span>
                      {t("landing.howStepLabel")}
                    </div>
                    <div className="relative mt-5 flex h-24 items-center justify-center" aria-hidden="true">
                      <div className="absolute bottom-1 h-4 w-32 rounded-[50%] bg-forest/10 dark:bg-white/10" />
                      <span className={`relative flex h-20 w-20 -rotate-6 items-center justify-center rounded-[1.6rem] border border-white/70 shadow-md ${tone.icon}`}>
                        <step.icon className="h-12 w-12 rotate-6" strokeWidth={1.6} />
                      </span>
                      <span className="absolute right-5 top-0 h-3 w-3 rounded-full bg-white/80" />
                      <span className="absolute left-6 bottom-5 h-2 w-2 rounded-full bg-forest/20" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold leading-snug text-content">{t(`landing.howSimple.title${index + 1}`)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t(`landing.howSimple.body${index + 1}`)}</p>
                    {index < 3 && <span className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-emerald shadow-sm lg:flex"><ArrowRight className="h-4 w-4" aria-hidden="true" /></span>}
                  </li>
                );
              })}
            </ol>
            <div className="relative mt-7 flex flex-col gap-5 overflow-hidden rounded-3xl bg-gradient-to-r from-[#073d2a] via-[#0d5a3d] to-[#16804f] p-6 text-white shadow-lg sm:p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold">{t("landing.howSimple.ctaTitle")}</h3>
                <p className="mt-1 text-sm text-green-100">{t("landing.howSimple.ctaBody")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/crop-rotation" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-[#d9f99d] px-6 py-3 text-base font-bold text-[#143d24] shadow-md transition-colors hover:bg-[#bef264] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <Sprout className="h-5 w-5" aria-hidden="true" />{t("landing.howSimple.cta")}<ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link href="/climate" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                  <CloudSun className="h-4 w-4" aria-hidden="true" />{t("publicHeader.climateData")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="data" aria-labelledby="home-data-title" className="scroll-mt-20 border-t border-line bg-surface px-4 py-12 dark:bg-bg sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <h2 id="home-data-title" className="text-3xl font-bold tracking-tight text-[#0B3D91] dark:text-sky-300 sm:text-4xl">{t("landing.dataOverview.title")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{t("landing.dataOverview.intro")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {overviewDatasets.map((dataset) => {
                const source = Array.isArray(liveDataSources) ? liveDataSources.find((item) => item.datasetKey === dataset.key) : null;
                const Icon = dataset.icon;
                const dates = [source?.firstObservationDate, source?.lastObservationDate];
                const formatSourceDate = (value) => {
                  const date = new Date(value);
                  return value && !Number.isNaN(date.getTime()) ? date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : null;
                };
                const coverage = dataset.name === "NASA POWER" && dates.every((value) => value && !Number.isNaN(new Date(value).getTime()))
                  ? dates.map((value) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", { useGrouping: false }).format(new Date(value).getUTCFullYear())).join("–")
                  : dates.map(formatSourceDate).filter(Boolean).join(" – ");
                return (
                  <article key={dataset.key} className={`relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-5 pb-20 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none ${dataset.tone}`}>
                    <DatasetScene kind={dataset.name} />
                    <span className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${dataset.iconTone}`}>
                      <Icon className="h-10 w-10" strokeWidth={1.7} aria-hidden="true" />
                      {dataset.name === "SMAP" && <Droplets className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-sky-100 p-1 text-sky-600 dark:bg-sky-950" aria-hidden="true" />}
                      {dataset.name === "MODIS" && <ScanLine className="absolute inset-1 h-14 w-14 text-violet-600/50 dark:text-violet-300/60" strokeWidth={1.2} aria-hidden="true" />}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-content">{dataset.name}</h3>
                    <p className="mt-1 min-h-12 text-sm leading-relaxed text-muted">{t(`landing.dataOverview.${dataset.meaning}`)}</p>
                    <div className="mt-4 flex items-start gap-2.5 border-t border-current/10 pt-3 text-xs text-muted"><CalendarRange className="mt-0.5 h-5 w-5 shrink-0 text-forest dark:text-emerald" aria-hidden="true" /><div>
                      <p className="font-medium">{t("landing.dataOverview.period")}</p>
                      <p className="mt-1 leading-relaxed text-content">{coverage || t("landing.dataOverview.noDates")}</p>
                    </div></div>
                    <details className="mt-4 text-xs text-muted">
                      <summary className={`w-fit cursor-pointer rounded-lg px-3 py-2 font-semibold shadow-sm ${dataset.iconTone}`}>{t("landing.dataOverview.details")}</summary>
                      <div className="mt-3 space-y-2 break-words leading-relaxed">
                        <p>{getSourceStatus(dataset.key)}</p>
                        {source?.product && <p>{source.product}</p>}
                        {source?.spatialResolution && <p>{source.spatialResolution}</p>}
                        {dataset.name === "NASA POWER" && <>
                          <p>{t("landing.dataOverview.records")}: {formattedObsCount}</p>
                          {source?.timeStandard && <p>{source.timeStandard}</p>}
                          {source?.timeStandardDisclosure && <p>{source.timeStandardDisclosure}</p>}
                          {activeParameters.length > 0 && <p className="font-mono">{activeParameters.map(([code, meta]) => `${code} (${meta.unit})`).join(", ")}</p>}
                        </>}
                        {dataset.name === "MODIS" && <p>{t("landing.dataOverview.modisPeriod")}</p>}
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
            <div className="mt-6">
              <Button href="/data-sources" variant="primary" size="sm"><Database className="mr-2 h-4 w-4" aria-hidden="true" />{t("landing.dataOverview.sources")}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button>
            </div>
          </div>
        </section>

        {/* 0-7 & 7-14 Day Outlook — plain-language forecast summary */}
        <section id="outlook" aria-labelledby="outlook-title" className="scroll-mt-20 border-t border-line bg-gradient-to-b from-sky-50/50 via-surface to-emerald/5 dark:from-sky-950/15 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="outlook-title" className="text-3xl font-bold tracking-tight text-[#0B3D91] dark:text-sky-300 sm:text-4xl">
                {t("landing.sectionOutlook")}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted sm:text-lg leading-relaxed">
                {t("landing.sectionOutlookSub")}
              </p>
            </div>

            {/* District selector — right-aligned above the cards, data follows the selection */}
            <div className="mt-6 flex justify-center sm:justify-end">
              <label className="relative inline-flex items-center">
                <MapPin className="pointer-events-none absolute left-3 h-4 w-4 text-emerald" aria-hidden="true" />
                <select
                  value={selectedDistrict}
                  onChange={(event) => setSelectedDistrict(event.target.value)}
                  aria-label={t("landing.outlookSelectLabel")}
                  className="appearance-none rounded-xl border border-line bg-surface py-2.5 pl-9 pr-10 text-sm font-semibold text-content shadow-sm transition-colors cursor-pointer hover:border-emerald/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 dark:bg-surface-card"
                >
                  {(locationDistricts.length > 0 ? locationDistricts : [{ code: "chattogram", nameEn: "Chattogram", nameBn: "চট্টগ্রাম" }, { code: "cumilla", nameEn: "Cumilla", nameBn: "কুমিল্লা" }]).map((district) => (
                    <option key={district.code} value={district.code}>
                      {locale === "bn" ? district.nameBn : district.nameEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted" aria-hidden="true" />
              </label>
            </div>

            {forecastStatus === "loading" ? (
              <div className="mt-4 grid gap-6 lg:grid-cols-2" aria-busy="true">
                {[0, 1].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-line bg-surface p-6 shadow-km-sm dark:bg-surface-card">
                    <div className="h-5 w-40 rounded bg-surface-2" />
                    <div className="mt-2 h-4 w-28 rounded bg-surface-2" />
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[0, 1, 2, 3].map((j) => (
                        <div key={j} className="h-16 rounded-xl bg-surface-2" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : !shortWindowSummary || !extendedWindowSummary ? (
              <div className="mt-4 rounded-2xl border border-line bg-surface p-6 text-center shadow-km-sm dark:bg-surface-card">
                <p className="text-sm text-muted">{t("landing.outlookUnavailable")}</p>
                <Button href="/climate" variant="outline" size="sm" className="mt-4">
                  {t("landing.outlookUnavailableCta")}
                </Button>
              </div>
            ) : (
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                {outlookWindows.map(({ key, icon: WindowIcon, titleKey, summary }) => (
                  <div key={key} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-6 ${key === "short" ? "border-amber-200 bg-gradient-to-br from-amber-50 via-surface to-orange-50 dark:border-amber-800 dark:from-amber-950/30 dark:via-surface dark:to-surface" : "border-sky-200 bg-gradient-to-br from-sky-50 via-surface to-cyan-50 dark:border-sky-800 dark:from-sky-950/40 dark:via-surface dark:to-surface"}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line/80 pb-4">
                      <div className="flex items-start gap-3.5">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${key === "short" ? "bg-amber-200/70 text-orange-600 dark:bg-amber-900/50 dark:text-amber-300" : "bg-sky-200/70 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"}`}>
                          {key === "short" ? <Sun className="h-9 w-9" strokeWidth={1.6} aria-hidden="true" /> : <WindowIcon className="h-9 w-9" strokeWidth={1.6} aria-hidden="true" />}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-content sm:text-lg">
                            {t(`landing.${titleKey}`)}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted">{summary.dateRange}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-orange-200/70 bg-orange-100/60 p-3 dark:border-orange-800/50 dark:bg-orange-950/30">
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-orange-800 dark:text-orange-300">
                          <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {t("landing.outlookTempMax")}
                        </span>
                        <span className="mt-1 block text-lg font-bold text-content">
                          {summary.tempMax != null ? `${formatLocalizedNumber(summary.tempMax)}°C` : "—"}
                        </span>
                      </div>
                      <div className="rounded-xl border border-teal-200/70 bg-teal-100/60 p-3 dark:border-teal-800/50 dark:bg-teal-950/30">
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-teal-800 dark:text-teal-300">
                          <Thermometer className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {t("landing.outlookTempMin")}
                        </span>
                        <span className="mt-1 block text-lg font-bold text-content">
                          {summary.tempMin != null ? `${formatLocalizedNumber(summary.tempMin)}°C` : "—"}
                        </span>
                      </div>
                      <div className="rounded-xl border border-sky-200/70 bg-sky-100/60 p-3 dark:border-sky-800/50 dark:bg-sky-950/30">
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-800 dark:text-sky-300">
                          <CloudRain className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {t("landing.outlookRainTotal")}
                        </span>
                        <span className="mt-1 block text-lg font-bold text-content">
                          {`${formatLocalizedNumber(summary.rainTotal)} mm`}
                        </span>
                      </div>
                      <div className="rounded-xl border border-violet-200/70 bg-violet-100/60 p-3 dark:border-violet-800/50 dark:bg-violet-950/30">
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-800 dark:text-violet-300">
                          <Droplets className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {t("landing.outlookRainProb")}
                        </span>
                        <span className="mt-1 block text-lg font-bold text-content">
                          {`${formatLocalizedNumber(summary.rainProbMax)}%`}
                        </span>
                      </div>
                    </div>


                    {/* Grounded decision advisory */}
                    {outlookAdvisories[key] ? (
                      (() => {
                        const advisory = outlookAdvisories[key];
                        const AdvisoryIcon = advisory.icon;
                        return (
                          <div className="mt-5 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/80 p-4 dark:border-sky-800 dark:bg-sky-950/30">
                            <AdvisoryIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                                {t("landing.outlookAdvisoryTitle")}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-content">
                                {advisory.body}
                              </p>
                            </div>
                          </div>
                        );
                      })()
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {/* View details — navigates to the short-term weather section on the Climate Data page */}
            <div className="mt-6 flex justify-center">
              <Link
                href="/climate#short-term-weather"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
              >
                <span>{t("landing.outlookDetailsCta")}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title" className="scroll-mt-20 border-t border-line bg-surface px-4 py-14 dark:bg-bg sm:px-6 sm:py-16">
          <div className="sr-only">
            Evidence-Based Decision Support | প্রমাণভিত্তিক সিদ্ধান্ত গ্রহণ.
            Our current work focuses on Cumilla and Chattogram.
            বর্তমানে আমাদের কাজ কুমিল্লা ও চট্টগ্রামকে কেন্দ্র করে।
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="about-title" className="text-3xl font-bold tracking-tight text-forest dark:text-green-200 sm:text-4xl">{t("landing.sectionAbout")}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{t("landing.aboutSimple.subtitle")}</p>
            </div>
            <div className="relative isolate mx-auto mt-8 max-w-5xl overflow-hidden rounded-3xl border border-green-300 bg-gradient-to-br from-[#f5fbdc] via-[#eff9e9] to-[#d9efc2] p-6 pb-24 shadow-md dark:border-green-800 dark:from-[#203524] dark:via-surface-card dark:to-[#183c29] sm:p-9 sm:pb-24">
              <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 -z-10 h-56 w-56 rounded-full bg-amber-200/25 blur-3xl dark:bg-amber-400/5" />
              <div className="relative max-w-3xl">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-200 text-green-800 shadow-sm ring-1 ring-green-300 dark:bg-green-900/50 dark:text-green-300 dark:ring-green-700"><Sprout className="h-7 w-7" aria-hidden="true" /></span>
                <h3 className="text-2xl font-bold text-forest dark:text-green-200">{t("landing.aboutSimple.storyTitle")}</h3>
                <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{t("landing.aboutSimple.story")}</p>
                <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{t("landing.aboutSimple.choice")}</p>
                <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{t("landing.aboutSimple.help")}</p>
                <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-muted"><MapPin className="mt-1 h-4 w-4 shrink-0 text-emerald" aria-hidden="true" />{t("landing.aboutSimple.coverage")}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/crop-rotation" variant="forest" size="md">{t("landing.howSimple.cta")}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
                  <Button href="/data-sources" variant="outline" size="md">{t("landing.aboutViewDataSources")}</Button>
                </div>
              </div>
              <Leaf className="pointer-events-none absolute right-4 top-12 -z-10 h-44 w-44 -rotate-12 text-green-600 opacity-[0.08] dark:text-green-200" strokeWidth={1} aria-hidden="true" />
              <svg aria-hidden="true" focusable="false" viewBox="0 0 1000 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 w-full opacity-65 dark:opacity-25">
                <path d="M0 72Q190 35 400 67T760 42T1000 53V90H0Z" fill="#b4d98a" />
                <path d="M0 85Q230 55 450 80T1000 55V90H0Z" fill="#81b84d" />
                <path d="M580 90Q760 55 1000 66M690 90Q850 66 1000 74M810 90Q910 77 1000 82" stroke="#dbedb6" strokeWidth="5" fill="none" />
                <g stroke="#5d9434" strokeWidth="2.5" fill="none" strokeLinecap="round">
                  <path d="M930 60V18m0 20-14-10m14 19 13-10m-13-9 12-11m-12 1-8-8M960 65V27m0 18-11-9m11 0 10-10m-10 29 13-10" />
                </g>
                <g fill="#c9b34e"><ellipse cx="922" cy="16" rx="3" ry="6" transform="rotate(-35 922 16)" /><ellipse cx="941" cy="22" rx="3" ry="6" transform="rotate(35 941 22)" /><ellipse cx="970" cy="31" rx="3" ry="6" transform="rotate(35 970 31)" /></g>
              </svg>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
