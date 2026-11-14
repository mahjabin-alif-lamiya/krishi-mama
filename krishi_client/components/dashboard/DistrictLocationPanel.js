"use client";

import { CloudSun, MapPin } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageContext.js";
import { getDistrictReferencePoint } from "@/lib/districtGeography.js";

export default function DistrictLocationPanel({ district, locale }) {
  const { t } = useLang();
  const point = getDistrictReferencePoint(district);
  const districtName = (locale === "bn" ? district?.nameBn || district?.nameEn : district?.nameEn) || t("dashboardUi.selectedDistrict");

  return (
    <section aria-labelledby="district-location-heading" className="relative isolate overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-lime-50 via-emerald-50 to-sky-100 p-6 shadow-km-sm sm:p-8 dark:border-emerald-900 dark:from-emerald-950 dark:via-emerald-950 dark:to-sky-950">
      <div className="sr-only">
        Scoped to Cumilla and Chattogram. The reference point is not your exact farm location.
        {point && `Coordinate: ${point.latitude}, ${point.longitude}`}
      </div>
      <div className="relative z-10 max-w-xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-emerald-800 shadow-sm dark:bg-emerald-900/70 dark:text-emerald-200"><CloudSun className="h-8 w-8" aria-hidden="true" /></div>
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{t("dashboardUi.areaClimate")}</p>
        <h2 id="district-location-heading" className="mt-2 flex items-center gap-2 text-3xl font-bold text-forest sm:text-4xl dark:text-emerald-100"><MapPin className="h-6 w-6 shrink-0" aria-hidden="true" />{districtName}</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted">{t("dashboardUi.areaClimateIntro")}</p>
      </div>
      <svg aria-hidden="true" viewBox="0 0 600 250" preserveAspectRatio="xMaxYMax meet" className="pointer-events-none absolute bottom-0 right-0 -z-10 h-full w-full opacity-25 sm:w-3/5 sm:opacity-70 dark:opacity-20">
        <circle cx="465" cy="65" r="35" fill="#facc15" />
        <g fill="#fff"><ellipse cx="335" cy="68" rx="48" ry="19" /><circle cx="320" cy="51" r="24" /><circle cx="352" cy="54" r="20" /></g>
        <g stroke="#38bdf8" strokeWidth="4" strokeLinecap="round"><path d="m310 105-6 13m27-13-6 13m27-13-6 13" /></g>
        <path d="M0 210Q150 120 310 185T600 155V250H0Z" fill="#a3d977" />
        <path d="M0 235Q210 170 390 211T600 185V250H0Z" fill="#65a844" />
        <g fill="none" stroke="#d9ed9c" strokeWidth="4"><path d="M210 250 570 197M300 250 580 207M400 250 600 218M500 250 600 232" /></g>
      </svg>
    </section>
  );
}
