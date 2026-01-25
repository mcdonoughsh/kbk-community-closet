'use client';

import { useEffect, useRef } from 'react';

interface ContactInfoSectionProps {
  phone: string;
  email: string;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
}

/**
 * ContactInfoSection - Phone and email fields organism
 */
export function ContactInfoSection({
  phone,
  email,
  onPhoneChange,
  onEmailChange,
}: ContactInfoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleInputChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; value: string }>;
      const { name, value } = customEvent.detail;
      
      if (name === 'phone') {
        onPhoneChange(value);
      } else if (name === 'email') {
        onEmailChange(value);
      }
    };

    section.addEventListener('kbk-input-change', handleInputChange);
    return () => section.removeEventListener('kbk-input-change', handleInputChange);
  }, [onPhoneChange, onEmailChange]);

  return (
    <kbk-form-section
      ref={sectionRef}
      heading="Contact Information"
      description="How can we reach you about your request?"
    >
      <div className="space-y-4">
        <kbk-input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={phone}
          required
        />
        <kbk-input
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={email}
        />
      </div>
    </kbk-form-section>
  );
}
