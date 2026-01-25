// Type declarations for custom Web Components
// Allows TypeScript to recognize kbk-* elements in JSX

import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'kbk-chip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          selected?: boolean;
          value?: string;
          disabled?: boolean;
        },
        HTMLElement
      >;
      'kbk-input': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          type?: string;
          placeholder?: string;
          value?: string;
          required?: boolean;
          name?: string;
        },
        HTMLElement
      >;
      'kbk-textarea': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          placeholder?: string;
          value?: string;
          rows?: number;
          name?: string;
        },
        HTMLElement
      >;
      'kbk-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'secondary';
          type?: 'button' | 'submit';
          disabled?: boolean;
        },
        HTMLElement
      >;
      'kbk-add-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          disabled?: boolean;
        },
        HTMLElement
      >;
      'kbk-form-section': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          heading?: string;
          description?: string;
        },
        HTMLElement
      >;
    }
  }
}
