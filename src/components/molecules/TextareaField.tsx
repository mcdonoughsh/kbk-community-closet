"use client";

import { useEffect, useRef } from "react";

interface TextareaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  helperText?: string;
}

/**
 * TextareaField - Label + kbk-textarea + helper text
 */
export function TextareaField({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 4,
  helperText,
}: TextareaFieldProps) {
  const textareaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; value: string }>;
      onChange(customEvent.detail.value);
    };

    textarea.addEventListener("kbk-textarea-change", handleChange);
    return () =>
      textarea.removeEventListener("kbk-textarea-change", handleChange);
  }, [onChange]);

  return (
    <div className="space-y-1">
      <kbk-textarea
        ref={textareaRef}
        label={label}
        name={name}
        placeholder={placeholder}
        value={value}
        rows={rows}
      />
      {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}
