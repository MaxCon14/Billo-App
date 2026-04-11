/**
 * Logo / Favicon auto-fetch service.
 *
 * Given a website URL or subscription name, resolves the best available
 * favicon using Google's favicon service (primary) with Clearbit as fallback.
 * For well-known services, logos resolve automatically from just the name.
 * Results are cached in-memory so repeated renders don't re-fetch.
 */

import { getDomainForService } from './knownServices';

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
 * Resolve the domain to use for logo lookup.
 * Priority: explicit websiteUrl > known service name match.
 */
function resolveDomain(
  websiteUrl: string | null | undefined,
  name: string | null | undefined
): string | null {
  if (websiteUrl) {
    const domain = extractDomain(websiteUrl);
    if (domain) return domain;
  }
  if (name) {
    return getDomainForService(name) ?? null;
  }
  return null;
}

/**
 * Resolve a logo URL for a subscription based on its website_url or name.
 * Returns the cached result immediately if available.
 */
export function getLogoUrl(
  websiteUrl: string | null | undefined,
  name?: string | null
): string | null {
  const domain = resolveDomain(websiteUrl, name);
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
export function getFallbackLogoUrl(
  websiteUrl: string | null | undefined,
  name?: string | null
): string | null {
  const domain = resolveDomain(websiteUrl, name);
  if (!domain) return null;
  return clearbitLogoUrl(domain);
}

/**
 * Extract domain from a URL for display or matching purposes.
 */
export { extractDomain };
