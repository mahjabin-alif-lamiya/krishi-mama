"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";

const LanguageContext = createContext({
  language: "bn",
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("bn");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("krishi_lang");
      if (savedLang === "bn" || savedLang === "en") {
        setLanguageState(savedLang);
        document.documentElement.setAttribute("lang", savedLang);
      } else {
        document.documentElement.setAttribute("lang", "bn");
      }
    } catch {
      // Fallback if localStorage is unavailable
    }
  }, []);

  const setLanguage = (newLang) => {
    if (newLang !== "bn" && newLang !== "en") return;
    setLanguageState(newLang);
    try {
      localStorage.setItem("krishi_lang", newLang);
      document.documentElement.setAttribute("lang", newLang);
    } catch {
      // Fallback
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === "bn" ? "en" : "bn";
    setLanguage(nextLang);
  };

  // Helper function to resolve dot-notated translation keys (e.g., 'nav.home', 'risk.safe')
  const t = (key, fallback = "") => {
    if (!key || typeof key !== "string") return fallback || "";

    const keys = key.split(".");
    let current = translations[language] || translations.bn;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English if key is missing in the active language
        let fallbackCurrent = translations.en;
        for (const fk of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === "object" && fk in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fk];
          } else {
            fallbackCurrent = null;
            break;
          }
        }
        return fallbackCurrent || fallback || key;
      }
    }

    return current !== undefined && current !== null ? current : (fallback || key);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
