"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import ChoiceCard from "@/components/cards/ChoiceCard";
import CropTraitBadge from "@/components/cards/CropTraitBadge";
import RiskCard from "@/components/cards/RiskCard";
import RecommendationCard from "@/components/cards/RecommendationCard";
import NextStepsCard from "@/components/cards/NextStepsCard";
import ListenButton from "@/components/ui/ListenButton";
import StepHeader from "@/components/planner/StepHeader";
import DivisionPicker from "@/components/planner/DivisionPicker";
import DistrictPicker from "@/components/planner/DistrictPicker";
import UseMyLocationButton from "@/components/planner/UseMyLocationButton";
import ActionBar from "@/components/planner/ActionBar";
import {
  DIVISIONS,
  DISTRICTS,
  getDistrictById,
} from "@/lib/bangladesh-districts";
import { ROTATIONS } from "@/lib/crops";
import { SOIL_TYPES, getSoilType } from "@/lib/soils";
import { PRIORITIES, rankRotations } from "@/lib/priorities";
import { formatNumber } from "@/lib/formatNumber";
import { buildFarmerSentence } from "@/lib/sentences";
import {
  getBestDelay,
  getBestDelayItem,
  buildRecommendationSentence,
  generateNextSteps,
} from "@/lib/advice";
import {
  Sprout,
  Wheat,
  RotateCcw,
  AlertCircle,
  Database,
  Sparkles,
  Droplet,
  Layers,
  ShieldAlert,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function PlannerPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  // 5-Step Wizard State:
  // 1: Place | 2: Soil | 3: Crop | 4: Goal | 5: Advice/Results
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Location selection
  // 1a: division, 1b: district
  const [placeSubStep, setPlaceSubStep] = useState("division");
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Step 2: Soil selection ("loam" default, "clay", "sandy")
  const [selectedSoil, setSelectedSoil] = useState("loam");

  // Step 3: Crop selection ("compare-all" default, or specific rotation key)
  const [selectedRotation, setSelectedRotation] = useState("compare-all");

  // Step 4: Farmer Priorities (array of 1 or 2: "lowest-risk", "saves-water", "protects-soil")
  const [selectedPriorities, setSelectedPriorities] = useState(["lowest-risk"]);

  // Step 5: Query and Ranking State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultsMap, setResultsMap] = useState({});
  const [rankedResults, setRankedResults] = useState([]);

  // Currently selected district object (fallback to Dhaka if not set)
  const currentDistrictObj = useMemo(() => {
    if (!selectedDistrict) return DISTRICTS.dhaka;
    return getDistrictById(selectedDistrict) || DISTRICTS.dhaka;
  }, [selectedDistrict]);

  // Handle Division Selection in Step 1a
  const handleSelectDivision = (divId) => {
    setSelectedDivision(divId);
    const existingDistrict = getDistrictById(selectedDistrict);
    if (!existingDistrict || existingDistrict.divisionId !== divId) {
      setSelectedDistrict(null);
    }
    setPlaceSubStep("district");
  };

  // Toggle priority selection in Step 4 (allows 1 or 2 priorities)
  const handleTogglePriority = (priorityId) => {
    if (selectedPriorities.includes(priorityId)) {
      if (selectedPriorities.length > 1) {
        setSelectedPriorities(selectedPriorities.filter((p) => p !== priorityId));
      }
    } else {
      if (selectedPriorities.length < 2) {
        setSelectedPriorities([...selectedPriorities, priorityId]);
      } else {
        setSelectedPriorities([selectedPriorities[1], priorityId]);
      }
    }
  };

  // Fetch API for one or all rotations when transitioning to Step 5
  const fetchDecisionData = async (dist, rotChoice, soil, priorities) => {
    setLoading(true);
    setError(null);

    const targetDistrict = dist || "dhaka";
    const rotationKeys =
      rotChoice === "compare-all"
        ? Object.keys(ROTATIONS)
        : [rotChoice];

    try {
      const fetchedMap = {};

      await Promise.all(
        rotationKeys.map(async (rotKey) => {
          const res = await fetch(`/api/handoff?district=${targetDistrict}&rotation=${rotKey}`);
          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.error || `HTTP ${res.status}`);
          }
          const data = await res.json();
          fetchedMap[rotKey] = data;
        })
      );

      // Also ensure all 3 rotations are fetched for ranking comparison if single was chosen
      if (rotChoice !== "compare-all") {
        for (const rk of Object.keys(ROTATIONS)) {
          if (!fetchedMap[rk]) {
            try {
              const r = await fetch(`/api/handoff?district=${targetDistrict}&rotation=${rk}`);
              if (r.ok) {
                fetchedMap[rk] = await r.json();
              }
            } catch {
              // Non-critical background fetch error
            }
          }
        }
      }

      setResultsMap(fetchedMap);

      // Rank rotations using transparent priority engine
      const ranked = rankRotations(fetchedMap, ROTATIONS, soil, priorities);
      setRankedResults(ranked);
    } catch (err) {
      setError(err.message || t("planner.errorTitle"));
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep === 1) {
      if (placeSubStep === "division") {
        if (selectedDivision) {
          setPlaceSubStep("district");
        }
        return;
      }
      if (placeSubStep === "district") {
        if (selectedDistrict) {
          setCurrentStep(2);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 4) {
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
      fetchDecisionData(
        selectedDistrict || "dhaka",
        selectedRotation,
        selectedSoil,
        selectedPriorities
      );
      return;
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      if (placeSubStep === "district") {
        setPlaceSubStep("division");
        return;
      }
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(1);
      setPlaceSubStep("district");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 4) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 5) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  const handleStartOver = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentStep(1);
    setPlaceSubStep("division");
    setResultsMap({});
    setRankedResults([]);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Next button disabled state
  const isNextDisabled = useMemo(() => {
    if (currentStep === 1) {
      if (placeSubStep === "division") return !selectedDivision;
      if (placeSubStep === "district") return !selectedDistrict;
    }
    if (currentStep === 2) return !selectedSoil;
    if (currentStep === 3) return !selectedRotation;
    if (currentStep === 4) return selectedPriorities.length === 0;
    return false;
  }, [currentStep, placeSubStep, selectedDivision, selectedDistrict, selectedSoil, selectedRotation, selectedPriorities]);

  // Header Title & Subtitle calculations
  const headerTitle = useMemo(() => {
    if (currentStep === 1) {
      return placeSubStep === "division"
        ? t("planner.qDivision") || (language === "bn" ? "আপনার বিভাগ কোনটি?" : "Which division is your land in?")
        : t("planner.qDistrict") || (language === "bn" ? "আপনার জেলা কোনটি?" : "Which district is your land in?");
    }
    if (currentStep === 2) {
      return t("planner.qSoil") || (language === "bn" ? "জমির মাটি কেমন?" : "What is your soil like?");
    }
    if (currentStep === 3) {
      return t("planner.qCrop") || (language === "bn" ? "পরের ফসল কোনটি?" : "What is your next crop?");
    }
    if (currentStep === 4) {
      return t("planner.qGoal") || (language === "bn" ? "আপনার প্রধান লক্ষ্য কী?" : "What is your main goal?");
    }
    return t("planner.qResults") || (language === "bn" ? "ফসলের সুপারিশ ও বপন সময়" : "Crop Advice & Sowing Time");
  }, [currentStep, placeSubStep, language, t]);

  const headerSubtitle = useMemo(() => {
    if (currentStep === 1) {
      if (placeSubStep === "district" && selectedDivision) {
        const divObj = DIVISIONS.find((d) => d.id === selectedDivision);
        const divName = divObj?.name[language] || divObj?.name.en || selectedDivision;
        return language === "bn" ? `${divName} বিভাগ` : `${divName} Division`;
      }
      return null;
    }
    if (currentStep === 2) {
      return null;
    }
    if (currentStep === 3) {
      return t("planner.cropAfterAman") || (language === "bn" ? "আমন ধান কাটার পর" : "After Aman rice");
    }
    if (currentStep === 4) {
      return t("planner.goalHint") || (language === "bn" ? "একটি বেছে নিন (সর্বোচ্চ ২টি পছন্দ করতে পারেন)" : "Choose one (a second choice is optional)");
    }
    return t("planner.qResultsSubtitle") || (language === "bn" ? "NASA-র ২৫ বছরের তথ্য ও মাটির বৈশিষ্ট্য অনুযায়ী" : "Based on 25 years of NASA observations and soil type");
  }, [currentStep, placeSubStep, selectedDivision, language, t]);

  // Derived metrics for Step 5 (Result Screen)
  const topPick = useMemo(() => {
    if (!rankedResults || rankedResults.length === 0) return null;
    return rankedResults[0];
  }, [rankedResults]);

  const topRotation = useMemo(() => {
    if (selectedRotation !== "compare-all" && ROTATIONS[selectedRotation]) {
      return ROTATIONS[selectedRotation];
    }
    return topPick?.rotation || ROTATIONS["aman-mustard"];
  }, [selectedRotation, topPick]);

  const topNasaData = useMemo(() => {
    return (
      resultsMap[topRotation.id] ||
      resultsMap[selectedRotation] ||
      Object.values(resultsMap)[0] ||
      null
    );
  }, [resultsMap, topRotation, selectedRotation]);

  const topDelayResults = useMemo(() => {
    if (topNasaData && Array.isArray(topNasaData.results)) {
      return topNasaData.results;
    }
    if (topPick && Array.isArray(topPick.delayResults)) {
      return topPick.delayResults;
    }
    return [];
  }, [topNasaData, topPick]);

  // Tie rule in advice.js: shorter delay on equal risk
  const bestDelay = useMemo(() => {
    return getBestDelay(topDelayResults);
  }, [topDelayResults]);

  const bestDelayItem = useMemo(() => {
    return getBestDelayItem(topDelayResults);
  }, [topDelayResults]);

  const bestRiskPercent = useMemo(() => {
    return bestDelayItem?.riskPercent ?? 0;
  }, [bestDelayItem]);

  const bestLevel = useMemo(() => {
    return bestDelayItem?.level ?? "safe";
  }, [bestDelayItem]);

  const recommendationSentence = useMemo(() => {
    return buildRecommendationSentence({
      rotation: topRotation,
      bestDelay,
      language,
    });
  }, [topRotation, bestDelay, language]);

  const nextSteps = useMemo(() => {
    return generateNextSteps({
      bestDelay,
      rotation: topRotation,
      soilId: selectedSoil,
      language,
    });
  }, [bestDelay, topRotation, selectedSoil, language]);

  const speechText = useMemo(() => {
    const reasonText = topPick?.reason?.[language] || topPick?.reason?.en || "";
    const stepsText = nextSteps.map((s) => s.text?.[language] || s.text?.en || "").join(" ");
    return `${recommendationSentence} ${reasonText} ${stepsText}`;
  }, [recommendationSentence, topPick, nextSteps, language]);

  const otherRotations = useMemo(() => {
    if (selectedRotation !== "compare-all" || !rankedResults || rankedResults.length <= 1) {
      return [];
    }
    return rankedResults.slice(1);
  }, [selectedRotation, rankedResults]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact Dark Header Band */}
      <StepHeader
        currentStep={currentStep}
        title={headerTitle}
        subtitle={headerSubtitle}
      />

      {/* Main Centered Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-between">
        <div className="w-full">
          {/* ================================================================= */}
          {/* STEP 1: PLACE (1a: Division, 1b: District)                        */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {placeSubStep === "division" ? (
                <div className="space-y-6">
                  <DivisionPicker
                    selectedDivision={selectedDivision}
                    onSelectDivision={handleSelectDivision}
                  />

                  <UseMyLocationButton
                    onSelectDistrict={(districtObj) => {
                      setSelectedDivision(districtObj.divisionId);
                      setSelectedDistrict(districtObj.id);
                      setPlaceSubStep("district");
                    }}
                  />
                </div>
              ) : (
                <DistrictPicker
                  divisionId={selectedDivision}
                  selectedDistrict={selectedDistrict}
                  onSelectDistrict={(dId, districtObj) => {
                    setSelectedDistrict(dId);
                    if (districtObj && districtObj.divisionId) {
                      setSelectedDivision(districtObj.divisionId);
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: SOIL (Clay, Loam, Sandy)                                  */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <ChoiceCard
                  icon={Droplet}
                  title={t("planner.soilClayTitle")}
                  subtitle={t("planner.soilClayDesc")}
                  selected={selectedSoil === "clay"}
                  onClick={() => setSelectedSoil("clay")}
                />
                <ChoiceCard
                  icon={Layers}
                  title={t("planner.soilLoamTitle")}
                  subtitle={t("planner.soilLoamDesc")}
                  selected={selectedSoil === "loam"}
                  onClick={() => setSelectedSoil("loam")}
                />
                <ChoiceCard
                  icon={Clock}
                  title={t("planner.soilSandyTitle")}
                  subtitle={t("planner.soilSandyDesc")}
                  selected={selectedSoil === "sandy"}
                  onClick={() => setSelectedSoil("sandy")}
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: CROP (Compare All, Mustard, Lentil, Wheat)                */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Compare All Option Card */}
              <ChoiceCard
                icon={Sparkles}
                title={t("planner.cropCompareAllTitle")}
                subtitle={t("planner.cropCompareAllDesc")}
                badge={t("planner.recommendedBadge")}
                selected={selectedRotation === "compare-all"}
                onClick={() => setSelectedRotation("compare-all")}
                className="border-2"
              />

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
                <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {language === "bn" ? "অথবা একটি নির্দিষ্ট ফসল" : "Or a specific crop"}
                </span>
                <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
              </div>

              {/* Individual Crop Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <ChoiceCard
                  icon={Sprout}
                  title={t("planner.cropMustardTitle")}
                  subtitle={t("planner.cropMustardDesc")}
                  selected={selectedRotation === "aman-mustard"}
                  onClick={() => setSelectedRotation("aman-mustard")}
                />
                <ChoiceCard
                  icon={Sprout}
                  title={t("planner.cropLentilTitle")}
                  subtitle={t("planner.cropLentilDesc")}
                  selected={selectedRotation === "aman-lentil"}
                  onClick={() => setSelectedRotation("aman-lentil")}
                />
                <ChoiceCard
                  icon={Wheat}
                  title={t("planner.cropWheatTitle")}
                  subtitle={t("planner.cropWheatDesc")}
                  selected={selectedRotation === "aman-wheat"}
                  onClick={() => setSelectedRotation("aman-wheat")}
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: GOAL (Lowest risk, Saves water, Protects soil)            */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <ChoiceCard
                  icon={ShieldAlert}
                  title={t("planner.goalRiskTitle")}
                  subtitle={t("planner.goalRiskDesc")}
                  selected={selectedPriorities.includes("lowest-risk")}
                  onClick={() => handleTogglePriority("lowest-risk")}
                />
                <ChoiceCard
                  icon={Droplet}
                  title={t("planner.goalWaterTitle")}
                  subtitle={t("planner.goalWaterDesc")}
                  selected={selectedPriorities.includes("saves-water")}
                  onClick={() => handleTogglePriority("saves-water")}
                />
                <ChoiceCard
                  icon={Sprout}
                  title={t("planner.goalSoilTitle")}
                  subtitle={t("planner.goalSoilDesc")}
                  selected={selectedPriorities.includes("protects-soil")}
                  onClick={() => handleTogglePriority("protects-soil")}
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 5: ADVICE / RESULTS (Farmer-Friendly Top-To-Bottom)           */}
          {/* ================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-fadeIn">
              {/* Loading State Skeleton */}
              {loading && (
                <div className="space-y-6 animate-pulse">
                  <div className="surface-dark rounded-2xl p-8 space-y-4">
                    <div className="h-6 w-32 rounded-full bg-white/10" />
                    <div className="h-10 w-3/4 rounded-xl bg-white/10" />
                    <div className="h-5 w-1/2 rounded bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl border space-y-4"
                        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                      >
                        <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
                        <div className="h-10 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
                        <div className="h-12 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div
                  className="p-8 rounded-2xl border text-center space-y-4 shadow-sm"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--risk-danger)",
                  }}
                >
                  <AlertCircle className="w-10 h-10 mx-auto" style={{ color: "var(--risk-danger)" }} />
                  <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                    {t("planner.errorTitle")}
                  </h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 max-w-md mx-auto leading-relaxed">
                    {error}
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        fetchDecisionData(
                          selectedDistrict,
                          selectedRotation,
                          selectedSoil,
                          selectedPriorities
                        )
                      }
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer"
                      style={{
                        backgroundColor: "#E5B84A",
                        color: "#0B3A22",
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t("planner.errorRetry")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      style={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      <span>{t("planner.changeAnswers")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Real Results: Exactly ordered 1 to 8 as specified */}
              {!loading && !error && topRotation && (
                <div className="space-y-8">
                  {/* 1. RecommendationCard */}
                  <RecommendationCard
                    rotation={topRotation}
                    sentence={recommendationSentence}
                    riskPercent={bestRiskPercent}
                    level={bestLevel}
                    isCompareAll={selectedRotation === "compare-all"}
                    rank={1}
                  />

                  {/* 2. ListenButton with Stop Option */}
                  <div className="flex justify-center sm:justify-start">
                    <ListenButton text={speechText} />
                  </div>

                  {/* 3. "Why" block with 3 RiskCard items for 0, 7, and 14 days */}
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                      {t("planner.whyTitle")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {topDelayResults.map((dr) => {
                        const delayLabel =
                          dr.delay === 0
                            ? t("home.day0Label")
                            : dr.delay === 7
                            ? t("home.day7Label")
                            : t("home.day14Label");

                        const sentenceObj = buildFarmerSentence({
                          delay: dr.delay,
                          wetYears: dr.wetYears || 0,
                          dryYears: dr.dryYears || 0,
                          flaggedYears: dr.flaggedYears,
                          yearsUsed: topNasaData?.yearsUsed || 25,
                          riskPercent: dr.riskPercent,
                          level: dr.level,
                        });
                        const sentence = sentenceObj[language] || sentenceObj.en;

                        return (
                          <RiskCard
                            key={dr.delay}
                            delayLabel={delayLabel}
                            riskPercent={dr.riskPercent}
                            description={sentence}
                            highlight={dr.delay === bestDelay}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Three small icon badges for the chosen rotation */}
                  <div
                    className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      {t("planner.cropTraitsTitle")} ({topRotation.cropName?.[language] || topRotation.cropName?.en})
                    </span>
                    <CropTraitBadge
                      waterNeed={topRotation.waterNeed}
                      durationDays={topRotation.durationDays}
                      soilHealthEffect={topRotation.soilHealthEffect}
                    />
                  </div>

                  {/* 5. NextStepsCard (exactly 3 short action lines) */}
                  <NextStepsCard steps={nextSteps} />

                  {/* 6. If farmer compared all: compact list of other two rotations */}
                  {selectedRotation === "compare-all" && otherRotations.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                          {t("planner.otherOptionsTitle")}
                        </h3>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {t("planner.otherOptionsSubtitle")}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {otherRotations.map((item) => {
                          const rot = item.rotation;
                          const rotBestDelay = getBestDelay(item.delayResults);
                          const rotDelayItem =
                            item.delayResults?.find((d) => d.delay === rotBestDelay) ||
                            item.delayResults?.[0];
                          const rotRisk = rotDelayItem?.riskPercent ?? 0;

                          return (
                            <div
                              key={item.rotationId}
                              className="p-5 rounded-2xl border shadow-xs space-y-3.5 transition-all"
                              style={{
                                backgroundColor: "var(--card)",
                                borderColor: "var(--border)",
                              }}
                            >
                              <div
                                className="flex items-center justify-between gap-2 border-b pb-3"
                                style={{ borderColor: "var(--border)" }}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border"
                                    style={{
                                      backgroundColor: "var(--background)",
                                      borderColor: "var(--border)",
                                      color: "var(--muted)",
                                    }}
                                  >
                                    #{formatNumber(item.rank, language)}
                                  </span>
                                  <h4 className="text-base font-bold" style={{ color: "var(--text)" }}>
                                    {rot.name[language] || rot.name.en}
                                  </h4>
                                </div>

                                <div className="text-xs font-bold text-right" style={{ color: "var(--muted)" }}>
                                  <span>
                                    {t("planner.safestDelayShort")}:{" "}
                                    <strong style={{ color: "var(--primary)" }}>
                                      {rotBestDelay === 0
                                        ? language === "bn" ? "০ দিন" : "0d"
                                        : `+${formatNumber(rotBestDelay, language)}d`}
                                    </strong>{" "}
                                    ({formatNumber(rotRisk, language)}%)
                                  </span>
                                </div>
                              </div>

                              <CropTraitBadge
                                waterNeed={rot.waterNeed}
                                durationDays={rot.durationDays}
                                soilHealthEffect={rot.soilHealthEffect}
                              />

                              <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--muted)" }}>
                                {item.reason[language] || item.reason.en}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 7. NASA Source & Disclaimer line */}
                  <div
                    className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white"
                        style={{
                          backgroundColor:
                            topNasaData?.source === "live" ? "var(--risk-safe)" : "var(--accent)",
                        }}
                      >
                        <Database className="w-3 h-3" />
                        <span>
                          {topNasaData?.source === "live"
                            ? t("planner.liveDataBadgeText")
                            : t("planner.savedDataBadgeText")}
                        </span>
                      </span>
                      <span className="font-semibold" style={{ color: "var(--text)" }}>
                        {currentDistrictObj.name[language] || currentDistrictObj.name.en}
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      {t("planner.nasaDisclaimerText")}
                    </p>
                  </div>

                  {/* 8. Action Buttons: Change my answers & Start over */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(4);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      style={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t("planner.changeAnswers")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStartOver}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold shadow-md transition-all cursor-pointer hover:brightness-105 active:scale-95"
                      style={{
                        backgroundColor: "#E5B84A",
                        color: "#0B3A22",
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{t("planner.startOver")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Action Bar for Steps 1-4 */}
        {currentStep < 5 && (
          <ActionBar
            onBack={handleBack}
            onNext={handleNext}
            isNextDisabled={isNextDisabled}
            nextLabel={
              currentStep === 4
                ? t("planner.btnSeeAdvice") || (language === "bn" ? "পরামর্শ দেখুন" : "See advice")
                : t("planner.btnNext") || (language === "bn" ? "পরবর্তী" : "Next")
            }
            backLabel={t("planner.btnBack") || (language === "bn" ? "পিছনে" : "Back")}
            showBack={!(currentStep === 1 && placeSubStep === "division")}
          />
        )}
      </div>
    </div>
  );
}
