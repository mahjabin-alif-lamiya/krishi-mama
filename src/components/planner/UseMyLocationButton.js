"use client";

import React, { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { findNearestDistrict } from "@/lib/nearestDistrict";

export default function UseMyLocationButton({
  onSelectDistrict,
  districts = null,
}) {
  const { t, language } = useLanguage();
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMessage(
        language === "bn"
          ? "আপনার ব্রাউজার লোকেশন সমর্থন করে না। তালিকা থেকে বেছে নিন।"
          : "Geolocation is not supported by your browser. Please pick from the list."
      );
      return;
    }

    setLocating(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { latitude, longitude } = position.coords;
        const nearest = findNearestDistrict(latitude, longitude, districts);
        if (nearest) {
          onSelectDistrict(nearest);
          const name = nearest.name[language] || nearest.name.en;
          setMessage(
            language === "bn"
              ? `নিকটবর্তী জেলা নির্বাচন করা হয়েছে: ${name}`
              : `Nearest district found: ${name}`
          );
        } else {
          setMessage(
            language === "bn"
              ? "কাছের জেলা শনাক্ত করা সম্ভব হয়নি। তালিকা থেকে নির্বাচন করুন।"
              : "Could not identify nearest district. Please select from the list."
          );
        }
      },
      (error) => {
        setLocating(false);
        setMessage(
          language === "bn"
            ? "অবস্থান পাওয়া যায়নি। তালিকা থেকে আপনার জেলা বেছে নিন।"
            : "Location access denied. Please choose your district from the list."
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="w-full flex flex-col items-center space-y-2 pt-2">
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={locating}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      >
        {locating ? (
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
        ) : (
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        )}
        <span>
          {locating
            ? t("planner.locating") || (language === "bn" ? "অবস্থান খোঁজা হচ্ছে..." : "Locating...")
            : t("planner.useMyLocation") || (language === "bn" ? "আমার অবস্থান ব্যবহার করুন" : "Use my location")}
        </span>
      </button>

      {/* Friendly status message if location was used or failed */}
      {message && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium text-center max-w-sm">
          {message}
        </p>
      )}

      {/* Muted line: Nearest NASA grid point explanation */}
      <p
        className="text-xs text-center max-w-md leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        {t("planner.gridNotice") ||
          (language === "bn"
            ? "আপনার নির্দিষ্ট জমি নয়, নিকটবর্তী নাসা গ্রিড পয়েন্টের তথ্য ব্যবহার করা হয়।"
            : "Data comes from the nearest NASA grid point to your district, not your exact field.")}
      </p>
    </div>
  );
}
