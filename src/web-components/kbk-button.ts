/**
 * <kbk-button> - Standard button
 * 
 * Attributes:
 * - variant: 'primary' | 'secondary' - button style
 * - type: 'button' | 'submit' - button type
 * - disabled: boolean - whether button is disabled
 * 
 * Events:
 * - kbk-button-click: CustomEvent<void>
 */
export class KbkButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'type', 'disabled'];
  }

  private shadow: ShadowRoot;
  private boundHandleClick: () => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.boundHandleClick = this.handleClick.bind(this);
    this.render();
  }

  connectedCallback() {
    this.shadow.querySelector('button')?.addEventListener('click', this.boundHandleClick);
  }

  disconnectedCallback() {
    this.shadow.querySelector('button')?.removeEventListener('click', this.boundHandleClick);
  }

  attributeChangedCallback() {
    this.render();
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }

  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get type(): string {
    return this.getAttribute('type') || 'button';
  }

  set type(val: string) {
    this.setAttribute('type', val);
  }

  private handleClick() {
    if (this.disabled) return;
    
    this.dispatchEvent(new CustomEvent('kbk-button-click', {
      bubbles: true,
      composed: true
    }));
  }

  private render() {
    const variant = this.variant;
    const type = this.type;
    const disabled = this.disabled;

    const isPrimary = variant === 'primary';

    this.shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        button {
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
          padding: 1rem 2rem;
          border-radius: var(--kbk-radius, 8px);
          border: none;
          background: ${isPrimary ? 'var(--kbk-primary, #2563eb)' : 'var(--kbk-secondary, #e5e7eb)'};
          color: ${isPrimary ? '#ffffff' : 'var(--kbk-text, #171717)'};
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          opacity: ${disabled ? '0.5' : '1'};
          transition: all 0.15s ease;
          width: 100%;
        }
        
        button:hover:not(:disabled) {
          background: ${isPrimary ? 'var(--kbk-primary-hover, #1d4ed8)' : 'var(--kbk-secondary-hover, #d1d5db)'};
        }
        
        button:focus {
          outline: 2px solid var(--kbk-border-focus, #2563eb);
          outline-offset: 2px;
        }
      </style>
      <button type="${type}" ${disabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `;
    
    // Re-attach event listener after render
    this.shadow.querySelector('button')?.addEventListener('click', this.boundHandleClick);
  }
}
