"use client";

import React from "react";

export default function ProblemCard({
  icon: Icon = null,
  title,
  description,
  iconBg = null,
  iconColor = null,
  className = "",
}) {
  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md space-y-4 ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Icon Container with soft tint */}
      {Icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs"
          style={{
            backgroundColor: iconBg || "var(--background)",
            borderColor: "var(--border)",
            color: iconColor || "var(--accent)",
          }}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}

      {/* Title */}
      <h3
        className="text-lg font-bold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        {description}
      </p>
    </div>
  );
}
