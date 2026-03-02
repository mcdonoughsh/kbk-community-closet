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
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(2, 90, 154, 0.1);
        }
        
        .heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #171717;
          margin: 0 0 0.25rem 0;
        }
        
        .description {
          font-size: 0.875rem;
          color: rgba(23, 23, 23, 0.8);
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
