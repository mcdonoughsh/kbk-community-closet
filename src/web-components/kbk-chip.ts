/**
 * <kbk-chip> - Selectable chip/pill button
 * 
 * Attributes:
 * - selected: boolean - whether the chip is selected
 * - value: string - the value associated with this chip
 * - disabled: boolean - whether the chip is disabled
 * 
 * Events:
 * - kbk-chip-toggle: CustomEvent<{ value: string; selected: boolean }>
 */
export class KbkChip extends HTMLElement {
  static get observedAttributes() {
    return ['selected', 'value', 'disabled'];
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

  get selected(): boolean {
    return this.hasAttribute('selected');
  }

  set selected(value: boolean) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
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

  private handleClick() {
    if (this.disabled) return;
    
    // Don't internally toggle state - let parent control it
    // Just dispatch event with the NEW state (opposite of current)
    const newSelected = !this.selected;
    
    this.dispatchEvent(new CustomEvent('kbk-chip-toggle', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        selected: newSelected
      }
    }));
  }

  private render() {
    const selected = this.selected;
    const disabled = this.disabled;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        button {
          font-family: inherit;
          font-size: 0.8125rem;
          padding: 0.375rem 0.625rem;
          border-radius: 0.5rem;
          border: 1px solid ${selected ? 'var(--kbk-primary, #036bb6)' : 'var(--kbk-primary, #036bb6)'};
          background: ${selected ? 'var(--kbk-primary, #036bb6)' : 'var(--kbk-card, #ffffff)'};
          color: ${selected ? '#ffffff' : 'var(--kbk-primary, #036bb6)'};
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          opacity: ${disabled ? '0.5' : '1'};
          transition: all 0.15s ease;
          min-width: 50px;
          text-align: center;
        }
        
        button:hover:not(:disabled) {
          background: ${selected ? 'var(--kbk-primary-hover, #025a9a)' : 'var(--kbk-background, #e6f4ff)'};
        }
        
        button:focus {
          outline: 2px solid var(--kbk-border-focus, #036bb6);
          outline-offset: 2px;
        }
      </style>
      <button ${disabled ? 'disabled' : ''} aria-pressed="${selected}">
        <slot></slot>
      </button>
    `;
    
    // Re-attach event listener after render
    this.shadow.querySelector('button')?.addEventListener('click', this.boundHandleClick);
  }
}
