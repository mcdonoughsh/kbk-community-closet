/**
 * <kbk-input> - Form input with label
 * 
 * Attributes:
 * - label: string - the label text
 * - type: string - input type (text, email, tel, etc.)
 * - placeholder: string - placeholder text
 * - value: string - input value
 * - required: boolean - whether input is required
 * - name: string - input name
 * 
 * Events:
 * - kbk-input-change: CustomEvent<{ name: string; value: string }>
 */
export class KbkInput extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'type', 'placeholder', 'value', 'required', 'name'];
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
    this.shadow.querySelector('input')?.addEventListener('input', this.boundHandleInput);
  }

  disconnectedCallback() {
    this.shadow.querySelector('input')?.removeEventListener('input', this.boundHandleInput);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    
    // For value changes, just update the input directly without re-rendering
    if (name === 'value') {
      const input = this.shadow.querySelector('input');
      if (input && document.activeElement !== input && input !== this.shadow.activeElement) {
        // Only update if the input is not focused (to avoid disrupting user typing)
        input.value = newValue || '';
      }
      return;
    }
    
    // For other attribute changes, re-render if we've already rendered once
    if (this.hasRendered) {
      this.render();
    }
  }

  get value(): string {
    return this.shadow.querySelector('input')?.value || this.getAttribute('value') || '';
  }

  set value(val: string) {
    const input = this.shadow.querySelector('input');
    if (input) {
      input.value = val;
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

  get type(): string {
    return this.getAttribute('type') || 'text';
  }

  set type(val: string) {
    this.setAttribute('type', val);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || '';
  }

  set placeholder(val: string) {
    this.setAttribute('placeholder', val);
  }

  get required(): boolean {
    return this.hasAttribute('required');
  }

  set required(val: boolean) {
    if (val) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('kbk-input-change', {
      bubbles: true,
      composed: true,
      detail: {
        name: this.name,
        value: input.value
      }
    }));
  }

  private render() {
    const label = this.label;
    const type = this.type;
    const placeholder = this.placeholder;
    const value = this.getAttribute('value') || '';
    const required = this.required;
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
        
        .required {
          color: #dc2626;
        }
        
        input {
          font-family: inherit;
          font-size: 1rem;
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--kbk-border, #d1d5db);
          border-radius: var(--kbk-radius, 8px);
          background: var(--kbk-card, #ffffff);
          color: var(--kbk-text, #171717);
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }
        
        input:focus {
          outline: none;
          border-color: var(--kbk-border-focus, #036bb6);
          box-shadow: 0 0 0 3px rgba(3, 107, 182, 0.1);
        }
        
        input::placeholder {
          color: var(--kbk-text-muted, #6b7280);
        }
      </style>
      ${label ? `<label>${label}${required ? '<span class="required">*</span>' : ''}</label>` : ''}
      <input 
        type="${type}" 
        placeholder="${placeholder}" 
        value="${value}"
        name="${name}"
        ${required ? 'required' : ''}
      />
    `;
    
    // Re-attach event listener after render
    this.shadow.querySelector('input')?.addEventListener('input', this.boundHandleInput);
  }
}
