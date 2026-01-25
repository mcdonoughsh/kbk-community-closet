/**
 * Register all KBK Web Components
 * 
 * Call this function once to register all custom elements.
 * Must be called on the client side only (not during SSR).
 */

export async function registerWebComponents() {
  // Only register in browser environment
  if (typeof window === 'undefined') return;

  // Dynamically import components to avoid SSR issues with HTMLElement
  const [
    { KbkChip },
    { KbkInput },
    { KbkTextarea },
    { KbkButton },
    { KbkAddButton },
    { KbkFormSection },
  ] = await Promise.all([
    import('./kbk-chip'),
    import('./kbk-input'),
    import('./kbk-textarea'),
    import('./kbk-button'),
    import('./kbk-add-button'),
    import('./kbk-form-section'),
  ]);

  // Check if already registered to avoid errors
  if (!customElements.get('kbk-chip')) {
    customElements.define('kbk-chip', KbkChip);
  }
  
  if (!customElements.get('kbk-input')) {
    customElements.define('kbk-input', KbkInput);
  }
  
  if (!customElements.get('kbk-textarea')) {
    customElements.define('kbk-textarea', KbkTextarea);
  }
  
  if (!customElements.get('kbk-button')) {
    customElements.define('kbk-button', KbkButton);
  }
  
  if (!customElements.get('kbk-add-button')) {
    customElements.define('kbk-add-button', KbkAddButton);
  }
  
  if (!customElements.get('kbk-form-section')) {
    customElements.define('kbk-form-section', KbkFormSection);
  }
}
