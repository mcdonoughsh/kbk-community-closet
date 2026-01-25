/**
 * <kbk-form-section> - White card container for form sections
 * 
 * Attributes:
 * - heading: string - section heading
 * - description: string - section description
 * 
 * Slots:
 * - default: section content
 */
export class KbkFormSection extends HTMLElement {
  static get observedAttributes() {
    return ['heading', 'description'];
  }

  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get heading(): string {
    return this.getAttribute('heading') || '';
  }

  set heading(val: string) {
    this.setAttribute('heading', val);
  }

  get description(): string {
    return this.getAttribute('description') || '';
  }

  set description(val: string) {
    this.setAttribute('description', val);
  }

  private render() {
    const heading = this.heading;
    const description = this.description;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .section {
          background: var(--kbk-card, #ffffff);
          border-radius: var(--kbk-radius-lg, 12px);
          padding: 1.5rem;
          border-left: 4px solid var(--kbk-background, #e6f4ff);
        }
        
        .heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--kbk-text, #171717);
          margin: 0 0 0.25rem 0;
        }
        
        .description {
          font-size: 0.875rem;
          color: var(--kbk-text-muted, #6b7280);
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }
        
        .content {
          margin-top: 1rem;
        }
      </style>
      <div class="section">
        ${heading ? `<h3 class="heading">${heading}</h3>` : ''}
        ${description ? `<p class="description">${description}</p>` : ''}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
