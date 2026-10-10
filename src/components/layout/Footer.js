"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sprout } from "lucide-react";

export default function Footer() {
  const { language, t } = useLanguage();

  const brandName = language === "bn" ? t("nav.brandBn") : t("nav.brand");

  const approachItems = [
    t("footer.approachItem1"),
    t("footer.approachItem2"),
    t("footer.approachItem3"),
  ];

  return (
    <footer
      className="w-full border-t transition-colors duration-200 mt-auto"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10 sm:space-y-12">
        {/* Clean Three-Column Layout on Desktop, Neatly Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Column 1 — Brand */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                style={{
                  backgroundColor: "rgba(22, 163, 74, 0.14)",
                  color: "#16A34A",
                }}
              >
                <Sprout className="w-5 h-5 text-current" />
              </div>
              <span
                className="text-lg sm:text-xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {brandName}
              </span>
            </div>

            <p
              className="text-xs sm:text-sm font-semibold leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              {t("footer.tagline")}
            </p>

            <p
              className="text-xs sm:text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--muted)" }}
            >
              {t("footer.supportingText")}
            </p>
          </div>

          {/* Column 2 — Our Approach */}
          <div className="space-y-3.5">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text)" }}
            >
              {t("footer.approachTitle")}
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              {approachItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "#16A34A" }}
                  />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Important Note */}
          <div className="space-y-3.5">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text)" }}
            >
              {t("footer.noteTitle")}
            </h3>

            <p
              className="text-xs sm:text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--muted)" }}
            >
              {t("footer.noteText")}
            </p>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div
          className="border-t pt-6 text-xs text-center sm:text-left transition-colors"
          style={{
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
