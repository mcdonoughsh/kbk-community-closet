'use client';

import { useEffect, useRef } from 'react';

interface ContactInfoSectionProps {
  name: string;
  phone: string;
  email: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
}

/**
 * ContactInfoSection - Name, phone, and email fields organism
 */
export function ContactInfoSection({
  name,
  phone,
  email,
  onNameChange,
  onPhoneChange,
  onEmailChange,
}: ContactInfoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleInputChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; value: string }>;
      const { name: fieldName, value } = customEvent.detail;
      
      if (fieldName === 'name') {
        onNameChange(value);
      } else if (fieldName === 'phone') {
        onPhoneChange(value);
      } else if (fieldName === 'email') {
        onEmailChange(value);
      }
    };

    section.addEventListener('kbk-input-change', handleInputChange);
    return () => section.removeEventListener('kbk-input-change', handleInputChange);
  }, [onNameChange, onPhoneChange, onEmailChange]);

  return (
    <kbk-form-section
      ref={sectionRef}
      heading="Contact Information"
      description="How can we reach you about your request?"
    >
      <div className="space-y-4">
        <kbk-input
          label="Name"
          name="name"
          type="text"
          placeholder="Your name"
          value={name}
          required
        />
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
