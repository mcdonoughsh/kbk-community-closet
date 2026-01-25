'use client';

import { useEffect, useRef } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helperText?: string;
}

/**
 * FormField - Label + kbk-input + helper text
 */
export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  helperText,
}: FormFieldProps) {
  const inputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; value: string }>;
      onChange(customEvent.detail.value);
    };

    input.addEventListener('kbk-input-change', handleChange);
    return () => input.removeEventListener('kbk-input-change', handleChange);
  }, [onChange]);

  return (
    <div className="space-y-1">
      <kbk-input
        ref={inputRef}
        label={label}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required || undefined}
      />
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
