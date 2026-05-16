// ============================================================
// LeetSkills MVP — TextArea Component
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================
// TODO: Implement reusable TextArea with character count

"use client";

import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  showCharCount?: boolean;
  minChars?: number;
}

export default function TextArea({
  label,
  showCharCount = false,
  minChars,
  ...props
}: TextAreaProps) {
  // TODO: Style with Tailwind + add character counter
  return (
    <div>
      <label>{label}</label>
      <textarea {...props} />
      {showCharCount && (
        <span>
          {String(props.value ?? "").length}
          {minChars ? ` / ${minChars} min` : ""}
        </span>
      )}
    </div>
  );
}
