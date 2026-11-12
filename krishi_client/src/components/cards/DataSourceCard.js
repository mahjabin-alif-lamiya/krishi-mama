"use client";

import React from "react";
import { Database, ExternalLink, Layers, MapPin, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DataSourceCard({
  datasetName,
  link = null,
  variables = [],
  coverage,
  note = null,
  className = "",
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between space-y-5 ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="space-y-4">
        {/* Header: Dataset Name + External Link */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs shrink-0"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--primary)",
              }}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3
                className="text-base sm:text-lg font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {datasetName}
              </h3>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--muted)" }}
              >
                {t("common.dataset")}
              </span>
            </div>
          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border transition-colors inline-flex items-center justify-center"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              title={t("common.viewDataset")}
              aria-label={t("common.viewDataset")}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Variables List */}
        {variables && variables.length > 0 && (
          <div className="space-y-2 pt-1">
            <span
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--muted)" }}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t("common.variables")}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {variables.map((variable, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg border shadow-3xs"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Coverage Information */}
        {coverage && (
          <div
            className="flex items-start gap-2 text-xs pt-1"
            style={{ color: "var(--muted)" }}
          >
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
            <div>
              <span className="font-bold text-xs" style={{ color: "var(--text)" }}>
                {t("common.coverage")}:{" "}
              </span>
              <span>{coverage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Note Callout */}
      {note && (
        <div
          className="p-3 rounded-xl border text-xs flex items-start gap-2 mt-2"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
          <p className="leading-relaxed">{note}</p>
        </div>
      )}
    </div>
  );
}
