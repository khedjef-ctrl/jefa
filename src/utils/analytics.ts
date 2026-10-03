/**
 * Privacy-friendly Analytics Hook
 * Logs events to console as a lightweight placeholder for future Plausible / PostHog integrations.
 * No PII or sensitive policy data is transmitted.
 */
export function trackEvent(name: string, props?: Record<string, any>): void {
  const timestamp = new Date().toISOString();
  console.log(`[QuoteCompare AI Analytics] ${name}`, {
    timestamp,
    ...props,
  });
}
