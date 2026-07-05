// =====================================================================
// GA4 CONFIGURATION
// Paste your real Google Analytics 4 Measurement ID below, AND in the
// gtag snippet inside index.html (search "G-XXXXXXXXXX" in both files).
// Until a real ID is set, all tracking calls are silently skipped.
// =====================================================================
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const isConfigured = () =>
  typeof window !== "undefined" && typeof window.gtag === "function" && !GA_MEASUREMENT_ID.includes("XXXXXXXXXX");

/** SPA-aware page_view, fired on every route change. */
export const trackPageView = (path: string) => {
  if (!isConfigured()) return;
  window.gtag!("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

type EventName = "game_start" | "game_end" | "reward_unlocked" | "email_signup";

export const trackEvent = (name: EventName, params?: Record<string, unknown>) => {
  if (!isConfigured()) return;
  window.gtag!("event", name, params ?? {});
};
