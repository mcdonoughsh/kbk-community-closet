/**
 * <kbk-textarea> - Textarea with label
 * 
 * Attributes:
 * - label: string - the label text
 * - placeholder: string - placeholder text
 * - value: string - textarea value
 * - rows: number - number of rows
 * - name: string - textarea name
 * 
 * Events:
 * - kbk-textarea-change: CustomEvent<{ name: string; value: string }>
 */
export class KbkTextarea extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'placeholder', 'value', 'rows', 'name'];
  }

  private shadow: ShadowRoot;
  private boundHandleInput: (e: Event) => void;
  private hasRendered = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.boundHandleInput = this.handleInput.bind(this);
  }

  connectedCallback() {
    if (!this.hasRendered) {
      this.render();
      this.hasRendered = true;
    }
    this.shadow.querySelector('textarea')?.addEventListener('input', this.boundHandleInput);
  }

  disconnectedCallback() {
    this.shadow.querySelector('textarea')?.removeEventListener('input', this.boundHandleInput);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    
    // For value changes, just update the textarea directly without re-rendering
    if (name === 'value') {
      const textarea = this.shadow.querySelector('textarea');
      if (textarea && document.activeElement !== textarea && textarea !== this.shadow.activeElement) {
        // Only update if the textarea is not focused (to avoid disrupting user typing)
        textarea.value = newValue || '';
      }
      return;
    }
    
    // For other attribute changes, re-render if we've already rendered once
    if (this.hasRendered) {
      this.render();
    }
  }

  get value(): string {
    return this.shadow.querySelector('textarea')?.value || this.getAttribute('value') || '';
  }

  set value(val: string) {
    const textarea = this.shadow.querySelector('textarea');
    if (textarea) {
      textarea.value = val;
    }
    this.setAttribute('value', val);
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }

  set name(val: string) {
    this.setAttribute('name', val);
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(val: string) {
    this.setAttribute('label', val);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || '';
  }

  set placeholder(val: string) {
    this.setAttribute('placeholder', val);
  }

  get rows(): number {
    return parseInt(this.getAttribute('rows') || '4', 10);
  }

  set rows(val: number) {
    this.setAttribute('rows', String(val));
  }

  private handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.dispatchEvent(new CustomEvent('kbk-textarea-change', {
      bubbles: true,
      composed: true,
      detail: {
        name: this.name,
        value: textarea.value
      }
    }));
  }

  private render() {
    const label = this.label;
    const placeholder = this.placeholder;
    const value = this.getAttribute('value') || '';
    const rows = this.rows;
    const name = this.name;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--kbk-text, #171717);
          margin-bottom: 0.25rem;
        }
        
        textarea {
          font-family: inherit;
          font-size: 1rem;
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--kbk-border, #d1d5db);
          border-radius: var(--kbk-radius, 8px);
          background: var(--kbk-card, #ffffff);
          color: var(--kbk-text, #171717);
          box-sizing: border-box;
          resize: vertical;
          transition: border-color 0.15s ease;
        }
        
        textarea:focus {
          outline: none;
          border-color: var(--kbk-border-focus, #036bb6);
          box-shadow: 0 0 0 3px rgba(3, 107, 182, 0.1);
        }
        
        textarea::placeholder {
          color: var(--kbk-text-muted, #6b7280);
        }
      </style>
      ${label ? `<label>${label}</label>` : ''}
      <textarea 
        placeholder="${placeholder}" 
        rows="${rows}"
        name="${name}"
      >${value}</textarea>
    `;
    
    // Re-attach event listener after render
    this.shadow.querySelector('textarea')?.addEventListener('input', this.boundHandleInput);
  }
}
