// ============================================================
// LeetSkills MVP — Button Component
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================
// TODO: Implement reusable Button with variants (primary, secondary, ghost)

"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  // TODO: Implement styled button with Tailwind variants
  return (
    <button disabled={disabled || loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
}
