// ============================================================
// LeetSkills MVP — Card Component
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================
// TODO: Implement reusable Card container with optional title

"use client";

import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  // TODO: Style with Tailwind (rounded, shadow, padding)
  return (
    <div className={className}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
