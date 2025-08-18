import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  const { name, value, id } = metric
  
  // Get current page path
  const page = window.location.pathname
  const userAgent = navigator.userAgent

  // Send to our API endpoint
  fetch('/api/vitals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      value,
      id,
      page,
      userAgent,
    }),
  }).catch(console.error)
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onFCP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}
