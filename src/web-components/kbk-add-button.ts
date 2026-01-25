/**
 * <kbk-add-button> - Circular + button for adding items
 * 
 * Attributes:
 * - disabled: boolean - whether button is disabled
 * 
 * Events:
 * - kbk-add-click: CustomEvent<void>
 */
export class KbkAddButton extends HTMLElement {
  static get observedAttributes() {
    return ['disabled'];
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

  private handleClick() {
    if (this.disabled) return;
    
    this.dispatchEvent(new CustomEvent('kbk-add-click', {
      bubbles: true,
      composed: true
    }));
  }

  private render() {
    const disabled = this.disabled;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          background: var(--kbk-primary, #2563eb);
          color: #ffffff;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          opacity: ${disabled ? '0.5' : '1'};
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 300;
        }
        
        button:hover:not(:disabled) {
          background: var(--kbk-primary-hover, #1d4ed8);
          transform: scale(1.05);
        }
        
        button:focus {
          outline: 2px solid var(--kbk-border-focus, #2563eb);
          outline-offset: 2px;
        }
        
        .plus {
          line-height: 1;
        }
      </style>
      <button ${disabled ? 'disabled' : ''} aria-label="Add item">
        <span class="plus">+</span>
      </button>
    `;
    
    // Re-attach event listener after render
    this.shadow.querySelector('button')?.addEventListener('click', this.boundHandleClick);
  }
}
