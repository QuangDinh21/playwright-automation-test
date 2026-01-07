import type { Page, Locator } from '@playwright/test';

/**
 * Get a Playwright locator using the most appropriate Playwright locator method
 * Supports all Playwright built-in locator methods with smart detection
 *
 * Supported formats:
 * 1. Explicit format: "method:value" or "method:value,options"
 *    - "testId:connect-button" → page.getByTestId('connect-button')
 *    - "text:Welcome" → page.getByText('Welcome')
 *    - "role:button,Approve" → page.getByRole('button', { name: 'Approve' })
 *    - "label:Username" → page.getByLabel('Username')
 *    - "placeholder:Enter email" → page.getByPlaceholder('Enter email')
 *    - "alt:Logo" → page.getByAltText('Logo')
 *    - "title:Close" → page.getByTitle('Close')
 *
 * 2. CSS selector with data-testid: "[data-testid='connect-button']" → page.getByTestId()
 *
 * 3. Tag=text format: "button=Approve" → page.getByRole('button', { name: 'Approve' })
 *
 * 4. Plain string: tries getByTestId() first, then getByText()
 *
 * 5. CSS selector: uses page.locator() as-is
 *
 * @param page - The Playwright page object
 * @param selector - The selector string
 * @returns A Playwright Locator using the most appropriate method
 */
export function getLocator(page: Page, selector: string): Locator {
  // 1. Explicit format: "method:value" or "method:value,options"
  const explicitMatch = selector.match(/^(\w+):(.+)$/);
  if (explicitMatch) {
    const [, method, value] = explicitMatch;
    const methodLower = method.toLowerCase();

    switch (methodLower) {
      case 'testid':
        return page.getByTestId(value);
      case 'text':
        return page.getByText(value);
      case 'role': {
        // Format: "role:button,Approve" or "role:button"
        const parts = value.split(',');
        const role = parts[0].trim();
        const name = parts[1]?.trim();
        return name ? page.getByRole(role as any, { name }) : page.getByRole(role as any);
      }
      case 'label':
        return page.getByLabel(value);
      case 'placeholder':
        return page.getByPlaceholder(value);
      case 'alt':
        return page.getByAltText(value);
      case 'title':
        return page.getByTitle(value);
      default:
        // Unknown method, fall through to other checks
        break;
    }
  }

  // 2. CSS selector with data-testid: "[data-testid='connect-button']" or "button[data-testid='connect-button']"
  const testIdMatch = selector.match(/\[data-testid=['"]([^'"]+)['"]\]/);
  if (testIdMatch) {
    const testId = testIdMatch[1];
    // Extract tag if present (e.g., "button[data-testid='...']")
    const tagMatch = selector.match(/^(\w+)\[/);
    if (tagMatch) {
      // Use getByTestId with filter for the tag
      return page.getByTestId(testId).filter({ has: page.locator(tagMatch[1]) });
    }
    return page.getByTestId(testId);
  }

  // 3. Tag=text format: "button=Approve" → getByRole('button', { name: 'Approve' })
  const tagTextMatch = selector.match(/^(\w+)=(.+)$/);
  if (tagTextMatch) {
    const [, tag, text] = tagTextMatch;
    // Map common tags to roles
    const roleMap: Record<string, string> = {
      'button': 'button',
      'link': 'link',
      'a': 'link',
      'input': 'textbox',
      'textarea': 'textbox',
      'h1': 'heading',
      'h2': 'heading',
      'h3': 'heading',
      'h4': 'heading',
      'h5': 'heading',
      'h6': 'heading',
    };

    const role = roleMap[tag.toLowerCase()];
    if (role) {
      if (tag.match(/^h[1-6]$/)) {
        const level = parseInt(tag.charAt(1), 10) as 1 | 2 | 3 | 4 | 5 | 6;
        return page.getByRole('heading', { level, name: text });
      }
      return page.getByRole(role as any, { name: text });
    }
    // Fallback to locator with :has-text()
    return page.locator(tag).filter({ hasText: text });
  }

  // 4. If selector already contains :has-text() or is a complex CSS selector, use as-is
  if (selector.includes(':has-text(') || selector.includes(' ') || selector.includes('>') || selector.includes('+') || selector.includes('~')) {
    return page.locator(selector);
  }

  // 5. Plain string (alphanumeric, dash, underscore, spaces): try getByTestId() first, then getByText()
  // This handles cases like "Welcome to JOC Dashboard", "Approve", "connect-button"
  if (/^[\w\s-]+$/.test(selector)) {
    const testIdLocator = page.getByTestId(selector);
    const textLocator = page.getByText(selector);
    // Try testId first, if not found, try text
    return testIdLocator.or(textLocator);
  }

  // 6. Default: use selector as-is (CSS selector)
  return page.locator(selector);
}

