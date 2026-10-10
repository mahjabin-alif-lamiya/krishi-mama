"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon: Icon = null,
  ...props
}) {
  const { theme } = useTheme();

  // Size configurations
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5 font-bold",
  };

  // Base styling with CSS variables
  let variantStyle = {};
  let variantClasses = "";

  if (variant === "primary") {
    variantStyle = {
      backgroundColor: "var(--primary)",
      color: theme === "light" ? "#FFFFFF" : "#0A0A0A",
      borderColor: "transparent",
    };
    variantClasses = "shadow-sm hover:opacity-90 active:scale-[0.98]";
  } else if (variant === "secondary") {
    variantStyle = {
      backgroundColor: "var(--card)",
      color: "var(--text)",
      borderColor: "var(--border)",
    };
    variantClasses = "border shadow-2xs hover:bg-[var(--background)] active:scale-[0.98]";
  } else if (variant === "ghost") {
    variantStyle = {
      backgroundColor: "transparent",
      color: "var(--text)",
      borderColor: "transparent",
    };
    variantClasses = "hover:bg-[var(--border)] active:scale-[0.98]";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={variantStyle}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
