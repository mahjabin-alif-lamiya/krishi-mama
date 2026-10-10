"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Sprout, Sun, Moon, Menu, X, Languages } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/planner", label: t("nav.planner") },
    { href: "/data", label: t("nav.data") },
  ];

  const brandName = language === "bn" ? t("nav.brandBn") : t("nav.brand");

  return (
    <header
      className="sticky top-0 z-50 w-full transition-colors duration-200 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Logo Icon + Name + Tagline */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 rounded-xl py-1 px-1.5"
          style={{ outlineColor: "var(--primary)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs shrink-0"
            style={{
              backgroundColor: "rgba(22, 163, 74, 0.14)",
              color: "#16A34A",
            }}
          >
            <Sprout className="w-5 h-5 text-current" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg sm:text-xl font-bold tracking-tight leading-tight"
              style={{ color: "var(--text)" }}
            >
              {brandName}
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-medium leading-tight hidden sm:block"
              style={{ color: "var(--muted)" }}
            >
              {t("nav.tagline")}
            </span>
          </div>
        </Link>

        {/* Center/Right: Exactly 3 Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                  color: isActive
                    ? theme === "light"
                      ? "#FFFFFF"
                      : "#0A0A0A"
                    : "var(--text)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Far Right: Language Toggle & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shadow-2xs cursor-pointer"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            aria-label="Toggle language"
            title={language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
          >
            <Languages className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <span className="font-bold">
              {language === "bn" ? "EN" : "বাংলা"}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-xs font-semibold transition-all border shadow-2xs flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            aria-label={theme === "light" ? t("nav.themeToggleDark") : t("nav.themeToggleLight")}
            title={theme === "light" ? t("nav.themeToggleDark") : t("nav.themeToggleLight")}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" style={{ color: "var(--text)" }} />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border transition-colors flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Width Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-2 transition-all"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                  color: isActive
                    ? theme === "light"
                      ? "#FFFFFF"
                      : "#0A0A0A"
                    : "var(--text)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
