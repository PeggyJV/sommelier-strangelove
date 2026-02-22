import {
  Metric,
  onCLS,
  onFCP,
  onLCP,
  onTTFB,
  onINP,
} from "web-vitals"

function sendToAnalytics(metric: Metric) {
  const { name, value, id } = metric

  // Get current page path
  const page = window.location.pathname
  // Tag route & state for analysis
  const route = page.startsWith("/vaults") ? "vaults" : page
  const state = "with_legacy_deferred"
  const userAgent = navigator.userAgent

  // Send to our API endpoint
  fetch("/api/vitals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      value,
      id,
      page,
      route,
      state,
      userAgent,
    }),
  }).catch(console.error)
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onFCP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
  onINP(sendToAnalytics)
}
