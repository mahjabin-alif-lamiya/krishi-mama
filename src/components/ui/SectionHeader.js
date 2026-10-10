"use client";

import React from "react";

export default function SectionHeader({
  badge = null,
  title,
  subtitle = null,
  centered = false,
  className = "",
}) {
  return (
    <div
      className={`space-y-3 ${centered ? "text-center mx-auto max-w-3xl" : "max-w-2xl"} ${className}`}
    >
      {badge && (
        <div className={centered ? "flex justify-center" : "inline-block"}>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-2xs"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              color: "var(--primary)",
            }}
          >
            {badge}
          </span>
        </div>
      )}

      {title && (
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className="text-sm sm:text-base leading-relaxed font-medium"
          style={{ color: "var(--muted)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
