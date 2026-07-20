/**
 * LendSwift Accessibility Utilities
 * WCAG 2.1 AA Compliance helpers
 */

/**
 * Generate unique ID for form fields and their labels/errors
 */
let idCounter = 0;

export function generateId(prefix = 'ls'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/**
 * Helper to combine aria-describedby attributes
 * Useful for connecting form fields to error messages and helper text
 */
export function combineAriaDescribedBy(...ids: (string | undefined)[]): string | undefined {
  const filteredIds = ids.filter(Boolean);
  return filteredIds.length > 0 ? filteredIds.join(' ') : undefined;
}

/**
 * Create accessible error message attributes
 */
export function getErrorAttributes(hasError: boolean, errorId?: string) {
  if (!hasError) return {};

  return {
    'aria-invalid': true as const,
    'aria-describedby': errorId,
  };
}

/**
 * Get keyboard event handlers for accessibility
 * Supports Enter key for form submission and Escape for closing dropdowns
 */
export function isEnterKey(event: React.KeyboardEvent): boolean {
  return event.key === 'Enter' && !event.nativeEvent.isComposing;
}

export function isEscapeKey(event: React.KeyboardEvent): boolean {
  return event.key === 'Escape';
}

export function isArrowUpKey(event: React.KeyboardEvent): boolean {
  return event.key === 'ArrowUp';
}

export function isArrowDownKey(event: React.KeyboardEvent): boolean {
  return event.key === 'ArrowDown';
}

export function isTabKey(event: React.KeyboardEvent): boolean {
  return event.key === 'Tab';
}

/**
 * Announce screen reader messages
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
