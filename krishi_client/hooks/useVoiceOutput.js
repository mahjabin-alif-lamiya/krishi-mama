"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { prepareSpokenText, detectLanguage } from "@/lib/speechTextHelper.js";
import { generateAssistantSpeech } from "@/services/api.js";

const subscribeToBrowserSupport = () => () => {};
const getSpeechSynthesisSupport = () =>
  typeof window !== "undefined" && ("speechSynthesis" in window || "Audio" in window);
const getServerSupport = () => false;

function splitForSpeech(text, maxLength = 240) {
  const sentences = text.match(/[^.!?।]+(?:[.!?।]+(?=\s|$)|$)/g) || [text];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    const part = sentence.trim();
    if (!part) continue;
    if (part.length > maxLength) {
      if (current) chunks.push(current);
      current = "";
      for (let i = 0; i < part.length; i += maxLength) chunks.push(part.slice(i, i + maxLength));
    } else if (current && `${current} ${part}`.length > maxLength) {
      chunks.push(current);
      current = part;
    } else {
      current = current ? `${current} ${part}` : part;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

/**
 * useVoiceOutput
 * 
 * Production-ready Web Speech Synthesis hook for Krishi Mama AI Farmer Assistant.
 * Provides accessible, optional, farmer-controlled Text-to-Speech:
 * - Default 'bn-BD' (Bangla) with graceful detection and 'en-US' (English) support.
 * - Rigorous Bengali voice selection (never speaks Bengali with an English voice).
 * - Per-message active playback control (Play, Pause, Resume, Stop).
 * - Single-audio concurrency guarantee (cancels ongoing speech before starting new).
 * - Component unmount lifecycle cleanup (guaranteed cancellation).
 * - Safe for Next.js SSR / hydration.
 */
export function useVoiceOutput() {
  const isSupported = useSyncExternalStore(
    subscribeToBrowserSupport,
    getSpeechSynthesisSupport,
    getServerSupport
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [error, setError] = useState(null); // 'UNSUPPORTED' | 'VOICE_UNAVAILABLE_BN' | 'VOICE_UNAVAILABLE_EN' | 'EMPTY_TEXT' | 'PLAYBACK_ERROR'
  const [errorDetails, setErrorDetails] = useState("");

  const utteranceRef = useRef(null);
  const isComponentMounted = useRef(true);
  const playbackTokenRef = useRef(0);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  // Initialize and load available speech synthesis voices
  useEffect(() => {
    isComponentMounted.current = true;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices() || [];
        if (isComponentMounted.current) {
          setAvailableVoices(voices);
        }
      } catch (e) {
        console.warn("[useVoiceOutput] Failed to retrieve speech synthesis voices:", e);
      }
    };

    loadVoices();

    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);

    return () => {
      isComponentMounted.current = false;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore
        }
        window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
      }
      audioRef.current?.pause();
      audioRef.current = null;
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    };
  }, []);

  /**
   * Selects the highest quality matching voice for the target language.
   * If target is Bengali and no Bengali voice exists, returns null (never forces English).
   */
  const findBestVoice = useCallback((targetLang, voices) => {
    if (!voices || voices.length === 0) return null;
    const isBengali = targetLang.toLowerCase().startsWith("bn");

    if (isBengali) {
      // 1. Exact match 'bn-BD'
      let match = voices.find(
        (v) => v.lang.toLowerCase() === "bn-bd" || v.lang.toLowerCase() === "bn_bd"
      );
      if (match) return match;

      // 2. Any Bengali voice ('bn-IN', 'bn')
      match = voices.find((v) => v.lang.toLowerCase().startsWith("bn"));
      if (match) return match;

      // 3. Name containing Bangla / Bengali
      match = voices.find((v) => {
        const name = (v.name || "").toLowerCase();
        return name.includes("bengali") || name.includes("bangla");
      });
      if (match) return match;

      // Do NOT fall back to an English voice for Bengali!
      return null;
    } else {
      // English voice selection
      let match = voices.find(
        (v) => v.lang.toLowerCase() === "en-us" || v.lang.toLowerCase() === "en_us"
      );
      if (match) return match;

      match = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
      if (match) return match;

      match = voices.find((v) => v.default);
      return match || voices[0] || null;
    }
  }, []);

  // Stop playback immediately
  const stop = useCallback(() => {
    playbackTokenRef.current += 1;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentId(null);
  }, []);

  // Pause playback
  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPaused(true);
      return;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } catch {
        // Ignore
      }
    }
  }, []);

  // Resume playback
  const resume = useCallback(() => {
    if (audioRef.current?.paused) {
      audioRef.current.play().then(() => setIsPaused(false)).catch(() => setError("PLAYBACK_ERROR"));
      return;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } catch {
        // Ignore
      }
    }
  }, []);

  // Speak text with specified message ID and optional preferred language
  const speak = useCallback(
    (rawText, { id = null, preferredLang = null } = {}) => {
      setError(null);
      setErrorDetails("");

      const text = prepareSpokenText(rawText);
      if (!text) {
        setError("EMPTY_TEXT");
        return;
      }

      const targetLang = preferredLang || detectLanguage(text);
      const isBengali = targetLang.toLowerCase().startsWith("bn");
      if (typeof window === "undefined" || (!isBengali && !("speechSynthesis" in window))) {
        setError("UNSUPPORTED");
        return;
      }

      const playbackToken = ++playbackTokenRef.current;
      audioRef.current?.pause();
      audioRef.current = null;
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
      if (!isBengali) {
        try { window.speechSynthesis.cancel(); } catch { /* Ignore */ }
      }
      const browserVoices = !isBengali ? window.speechSynthesis.getVoices() || [] : [];
      const voices = browserVoices.length > 0 ? browserVoices : availableVoices;

      if (isBengali) {
        audioRef.current?.pause();
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioRef.current = null;
        audioUrlRef.current = null;
        const token = ++playbackTokenRef.current;
        setCurrentId(id);
        setIsSpeaking(true);
        generateAssistantSpeech(text).then((result) => {
          if (token !== playbackTokenRef.current) return;
          if (!result.success) {
            setError("PLAYBACK_ERROR");
            setErrorDetails(result.error?.message || "Bangla voice generation failed");
            setIsSpeaking(false);
            setCurrentId(null);
            return;
          }
          const url = URL.createObjectURL(result.data);
          const audio = new Audio(url);
          audioUrlRef.current = url;
          audioRef.current = audio;
          audio.onended = () => {
            if (token !== playbackTokenRef.current) return;
            URL.revokeObjectURL(url);
            audioRef.current = null;
            audioUrlRef.current = null;
            setIsSpeaking(false);
            setIsPaused(false);
            setCurrentId(null);
          };
          audio.onerror = () => {
            if (token !== playbackTokenRef.current) return;
            setError("PLAYBACK_ERROR");
            setErrorDetails("Bangla audio could not be played by this browser.");
            setIsSpeaking(false);
            setIsPaused(false);
            setCurrentId(null);
          };
          audio.play().catch((err) => {
            if (token !== playbackTokenRef.current) return;
            setError("PLAYBACK_ERROR");
            setErrorDetails(err.message || "Bangla audio playback failed");
            setIsSpeaking(false);
            setCurrentId(null);
          });
        }).catch((err) => {
          if (token !== playbackTokenRef.current) return;
          setError("PLAYBACK_ERROR");
          setErrorDetails(err.message || "Bangla voice generation failed");
          setIsSpeaking(false);
          setCurrentId(null);
        });
        return;
      }

      const voice = findBestVoice(targetLang, voices);
      // Never pass Bangla text to an English/default voice: it produces an
      // English-sounding mispronunciation while pretending Bangla is supported.
      const chunks = splitForSpeech(text);
      let chunkIndex = 0;

      const speakNextChunk = () => {
        if (!isComponentMounted.current || playbackToken !== playbackTokenRef.current) return;
        if (chunkIndex >= chunks.length) {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentId(null);
          return;
        }
        try {
          const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex++]);
          utterance.lang = voice?.lang || targetLang;
          if (voice) utterance.voice = voice;
          utterance.rate = isBengali ? 0.95 : 1.0;
          utterance.pitch = 1.0;
          utterance.onstart = () => {
            if (isComponentMounted.current && playbackToken === playbackTokenRef.current) {
              setIsSpeaking(true);
              setIsPaused(false);
              setCurrentId(id);
            }
          };
          utterance.onend = speakNextChunk;
          utterance.onerror = (e) => {
            if (!isComponentMounted.current || playbackToken !== playbackTokenRef.current) return;
            if (e.error !== "canceled" && e.error !== "interrupted") {
              console.warn("[useVoiceOutput] Speech synthesis error event:", e.error);
              setError("PLAYBACK_ERROR");
              setErrorDetails(e.error || "Speech playback failed");
            }
            setIsSpeaking(false);
            setIsPaused(false);
            setCurrentId(null);
          };
          utterance.onpause = () => playbackToken === playbackTokenRef.current && setIsPaused(true);
          utterance.onresume = () => playbackToken === playbackTokenRef.current && setIsPaused(false);
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("[useVoiceOutput] speak invocation failed:", err);
          setError("PLAYBACK_ERROR");
          setErrorDetails(err.message || "Failed to start speech");
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentId(null);
        }
      };
      try {
        speakNextChunk();
      } catch (err) {
        console.error("[useVoiceOutput] speak invocation failed:", err);
        setError("PLAYBACK_ERROR");
        setErrorDetails(err.message || "Failed to start speech");
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentId(null);
      }
    },
    [availableVoices, findBestVoice]
  );

  const clearError = useCallback(() => {
    setError(null);
    setErrorDetails("");
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    currentId,
    availableVoices,
    error,
    errorDetails,
    speak,
    pause,
    resume,
    stop,
    clearError,
  };
}
