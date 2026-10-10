"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Square } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * ListenButton: Voice readout using browser SpeechSynthesis.
 * Hides itself completely if no voice exists matching the selected language (bn-BD/bn-IN or en).
 *
 * @param {Object} props
 * @param {string} props.text - Full spoken advisory script
 * @param {string} [props.className=""] - Additional CSS classes
 */
export default function ListenButton({ text, className = "" }) {
  const { t, language } = useLanguage();
  const [hasVoice, setHasVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setHasVoice(false);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      if (language === "bn") {
        // Look for Bengali voices (bn-BD, bn-IN, or containing bengali/bangla)
        const bnVoice = voices.find((v) => {
          const l = (v.lang || "").toLowerCase();
          const n = (v.name || "").toLowerCase();
          return (
            l.startsWith("bn") ||
            l.includes("bengali") ||
            n.includes("bangla") ||
            n.includes("bengali")
          );
        });

        if (bnVoice) {
          voiceRef.current = bnVoice;
          setHasVoice(true);
        } else {
          voiceRef.current = null;
          setHasVoice(false);
        }
      } else {
        // Look for English voices
        const enVoice = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
        if (enVoice) {
          voiceRef.current = enVoice;
          setHasVoice(true);
        } else {
          voiceRef.current = null;
          setHasVoice(false);
        }
      }
    };

    checkVoices();

    window.speechSynthesis.onvoiceschanged = checkVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const handleTogglePlay = () => {
    if (!hasVoice || !text) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "bn" ? "bn-BD" : "en-US";
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // If no matching voice exists on this client, hide the button completely
  if (!hasVoice) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
        isSpeaking
          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20"
          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700"
      } ${className}`}
      aria-label={isSpeaking ? t("planner.stopListening") : t("planner.listenAdvice")}
    >
      {isSpeaking ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current text-rose-600 dark:text-rose-400" />
          <span>{t("planner.stopListening")}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("planner.listenAdvice")}</span>
        </>
      )}
    </button>
  );
}
