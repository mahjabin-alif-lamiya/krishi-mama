"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sprout, Calendar, ArrowRight, CheckCircle2, CloudSun, Leaf } from "lucide-react";

export default function AgriculturalHeroVisual() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Decorative soft glow behind card */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl pointer-events-none transition-colors"
        style={{
          background:
            "radial-gradient(circle, rgba(189, 232, 196, 0.8) 0%, rgba(33, 122, 69, 0.25) 50%, transparent 80%)",
        }}
      />

      {/* Main Visual Container */}
      <div
        className="relative rounded-3xl border shadow-xl overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Top Section: Agricultural Crop Fields Illustration (SVG) */}
        <div
          className="relative h-64 sm:h-72 w-full overflow-hidden flex flex-col justify-end"
          style={{
            background: "linear-gradient(180deg, #EAF5EA 0%, #F3F9F0 55%, #FFFFFF 100%)",
          }}
        >
          {/* Sky & Sun Elements */}
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs border"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#BDE8C4",
                color: "#123D2B",
              }}
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>{isBn ? "অনুকূল কৃষি মৌসুম" : "Optimal Sowing Season"}</span>
            </span>
          </div>

          {/* Morning Sun Disk */}
          <div
            className="absolute top-6 right-10 w-20 h-20 rounded-full opacity-70 blur-xs"
            style={{
              background: "radial-gradient(circle, #FDE68A 0%, rgba(254, 240, 138, 0.3) 70%, transparent 100%)",
            }}
          />

          {/* Layered Terraced Agricultural Fields SVG */}
          <svg
            viewBox="0 0 600 320"
            className="w-full h-auto max-h-56 object-cover transform translate-y-2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Distant Hills (Soft Green #BDE8C4) */}
            <path
              d="M0 160 C 120 120, 240 180, 380 140 C 480 110, 550 130, 600 150 L 600 320 L 0 320 Z"
              fill="#BDE8C4"
              fillOpacity="0.45"
            />

            {/* Midground Terraced Crop Field (#217A45) */}
            <path
              d="M0 195 C 140 165, 290 220, 440 180 C 520 160, 570 175, 600 190 L 600 320 L 0 320 Z"
              fill="#217A45"
              fillOpacity="0.8"
            />

            {/* Contour Crop Rows / Furrows on Midground */}
            <path
              d="M40 215 C 160 190, 280 230, 410 200 C 490 185, 550 195, 590 205"
              stroke="#BDE8C4"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeOpacity="0.7"
            />
            <path
              d="M60 235 C 180 210, 300 245, 430 220 C 500 205, 560 215, 600 225"
              stroke="#BDE8C4"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeOpacity="0.6"
            />

            {/* Foreground Lush Field (Deep Forest Green #123D2B) */}
            <path
              d="M0 240 C 150 220, 310 260, 460 235 C 530 225, 575 235, 600 245 L 600 320 L 0 320 Z"
              fill="#123D2B"
            />

            {/* Stylized Growing Plants in Foreground */}
            {/* Plant 1: Golden Rice Stalk (Harvest Stage) */}
            <g transform="translate(60, 160)">
              <path d="M20 90 Q 20 40 35 15" stroke="#C8961E" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="37" cy="14" rx="4" ry="7" fill="#EAB308" transform="rotate(25 37 14)" />
              <ellipse cx="30" cy="24" rx="3.5" ry="6" fill="#EAB308" transform="rotate(20 30 24)" />
              <ellipse cx="23" cy="35" rx="3.5" ry="6" fill="#CA8A04" transform="rotate(-15 23 35)" />
              <path d="M20 70 Q 5 60 0 70" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Plant 2: Sprouting Rabi Seedlings (Fresh Green Accent #16A34A) */}
            <g transform="translate(190, 175)">
              <path d="M25 80 Q 25 35 25 10" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
              {/* Left Leaf */}
              <path
                d="M25 35 C 10 30, 0 15, 10 10 C 20 5, 25 20, 25 35 Z"
                fill="#22C55E"
              />
              {/* Right Leaf */}
              <path
                d="M25 25 C 40 20, 50 5, 40 0 C 30 -5, 25 10, 25 25 Z"
                fill="#16A34A"
              />
              <circle cx="25" cy="5" r="4" fill="#FACC15" />
            </g>

            {/* Plant 3: Young Mustard / Pulse with Blossom */}
            <g transform="translate(340, 165)">
              <path d="M20 90 Q 25 45 30 15" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
              <path
                d="M23 45 C 5 40, 0 25, 10 20 C 18 15, 23 30, 23 45 Z"
                fill="#22C55E"
              />
              <path
                d="M28 35 C 45 30, 50 15, 42 10 C 35 5, 28 20, 28 35 Z"
                fill="#16A34A"
              />
              {/* Mustard Flower Blossom */}
              <circle cx="30" cy="12" r="5" fill="#FACC15" />
              <circle cx="26" cy="9" r="3.5" fill="#FDE047" />
              <circle cx="34" cy="9" r="3.5" fill="#FDE047" />
            </g>

            {/* Plant 4: Vigorous Wheat Tiller */}
            <g transform="translate(480, 170)">
              <path d="M20 85 Q 18 40 22 10" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
              <path d="M20 60 Q 40 50 45 60" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M19 45 Q 0 35 -5 45" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="22" cy="12" rx="3.5" ry="8" fill="#84CC16" />
            </g>
          </svg>
        </div>

        {/* Bottom Section: Crop-Season Timeline Card */}
        <div
          className="p-5 sm:p-6 space-y-4 border-t transition-colors"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {/* Timeline Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(33, 122, 69, 0.12)",
                  color: "#217A45",
                }}
              >
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold" style={{ color: "var(--text)" }}>
                {isBn ? "ফসল পরিবর্তনের সময়রেখা" : "Crop Season Transition Timeline"}
              </h3>
            </div>

            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(22, 163, 74, 0.12)",
                color: "#16A34A",
              }}
            >
              {isBn ? "ঋতুভিত্তিক ক্যালেন্ডার" : "Seasonal Flow"}
            </span>
          </div>

          {/* 3-Stage Timeline Nodes */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
            {/* Stage 1: Previous Crop (Aman) */}
            <div
              className="p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {isBn ? "১ম ধাপ" : "Stage 1"}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>
                  {isBn ? "আমন ধান" : "Aman Rice"}
                </h4>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {isBn ? "কর্তন পর্ব" : "Harvest"}
                </p>
              </div>

              <span
                className="text-[10px] font-semibold pt-1 border-t block"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {isBn ? "কার্তিক–অগ্রহায়ণ" : "Oct – Nov"}
              </span>
            </div>

            {/* Stage 2: Sowing Window / Handoff (Current Action) */}
            <div
              className="p-3 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all ring-2 ring-emerald-500/20"
              style={{
                backgroundColor: "rgba(33, 122, 69, 0.08)",
                borderColor: "#217A45",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {isBn ? "বপন উইন্ডো" : "Handoff"}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {isBn ? "০, ৭ বা ১৪ দিন" : "0, 7 or 14d"}
                </h4>
                <p className="text-[10px] mt-0.5 text-emerald-700 dark:text-emerald-400">
                  {isBn ? "মাটির আর্দ্রতা" : "Soil Moisture"}
                </p>
              </div>

              <span
                className="text-[10px] font-semibold pt-1 border-t block text-emerald-800 dark:text-emerald-300"
                style={{ borderColor: "rgba(33, 122, 69, 0.2)" }}
              >
                {isBn ? "সিদ্ধান্তের সময়" : "Planning Window"}
              </span>
            </div>

            {/* Stage 3: Next Rabi Crop */}
            <div
              className="p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {isBn ? "২য় ধাপ" : "Stage 2"}
                  </span>
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>
                  {isBn ? "রবি আবাদ" : "Rabi Crops"}
                </h4>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {isBn ? "সরিষা • মসুর • গম" : "Mustard • Lentil • Wheat"}
                </p>
              </div>

              <span
                className="text-[10px] font-semibold pt-1 border-t block"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {isBn ? "পৌষ–ফাল্গুন" : "Nov – Feb"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
