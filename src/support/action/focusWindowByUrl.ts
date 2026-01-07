import type { BrowserContext, Page } from '@playwright/test';

/**
 * Helper function to focus a window/page by URL pattern
 * @param context - The browser context
 * @param urlIncludes - The URL pattern to search for
 * @returns The page matching the URL pattern
 * @throws Error if no page with the URL pattern is found
 */
export async function focusWindowByUrl(context: BrowserContext, urlIncludes: string): Promise<Page> {
  for (const p of context.pages()) {
    const u = p.url();
    if (u && u.includes(urlIncludes)) {
      await p.bringToFront();
      return p;
    }
  }

  const p = await context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
  if (p && p.url().includes(urlIncludes)) {
    await p.bringToFront();
    return p;
  }

  for (const p2 of context.pages()) {
    if (p2.url().includes(urlIncludes)) {
      await p2.bringToFront();
      return p2;
    }
  }

  throw new Error(`Window with url including "${urlIncludes}" not found`);
}

