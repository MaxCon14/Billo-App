/**
 * Logo / Favicon auto-fetch service.
 *
 * Given a website URL, resolves the best available favicon using
 * Google's favicon service (primary) with Clearbit as fallback.
 * Results are cached in-memory so repeated renders don't re-fetch.
 */

const cache = new Map<string, string | null>();

function extractDomain(url: string): string | null {
  try {
    let clean = url.trim();
    if (!/^https?:\/\//i.test(clean)) clean = `https://${clean}`;
    const { hostname } = new URL(clean);
    return hostname;
  } catch {
    return null;
  }
}

function googleFaviconUrl(domain: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

function clearbitLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

/**
 * Resolve a logo URL for a subscription based on its website_url.
 * Returns the cached result immediately if available.
 */
export function getLogoUrl(websiteUrl: string | null | undefined): string | null {
  if (!websiteUrl) return null;
  const domain = extractDomain(websiteUrl);
  if (!domain) return null;

  if (cache.has(domain)) return cache.get(domain) ?? null;

  // Return the Google favicon URL directly — it's a reliable redirect service.
  // The Image component's onError will trigger the fallback flow.
  const url = googleFaviconUrl(domain);
  cache.set(domain, url);
  return url;
}

/**
 * Get the fallback logo URL (Clearbit) for a domain.
 */
export function getFallbackLogoUrl(websiteUrl: string | null | undefined): string | null {
  if (!websiteUrl) return null;
  const domain = extractDomain(websiteUrl);
  if (!domain) return null;
  return clearbitLogoUrl(domain);
}

/**
 * Extract domain from a URL for display or matching purposes.
 */
export { extractDomain };
