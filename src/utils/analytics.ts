import Analytics from "analytics"
// @ts-ignore - Missing type definitions for @analytics/mixpanel
import mixpanel from "@analytics/mixpanel"

const isBrowser = typeof window !== "undefined"

const analyticsEnabled =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED ?? "false"
let enabled = false
try {
  enabled = JSON.parse(analyticsEnabled)
  if (typeof enabled !== "boolean") {
    throw new Error("NEXT_PUBLIC_ANALYTICS_ENABLED is not a boolean")
  }
} catch (error) {
  enabled = false
  console.error(
    "Could not parse NEXT_PUBLIC_ANALYTICS_ENABLED as a boolean:",
    analyticsEnabled
  )
}

const appName =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Sommelier <Local>"

// Google Tag Manager
const gtmId = process.env.NEXT_PUBLIC_GTM_ID
const isSendToGTM =
  isBrowser && gtmId && gtmId !== null && gtmId.length > 0

const plugins: any[] = []

const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
if (isBrowser && mixpanelToken && mixpanelToken.length > 0) {
  plugins.push(
    mixpanel({
      token: mixpanelToken,
      api_host: process.env.NEXT_PUBLIC_MIXPANEL_PROXY_HOST ?? "",
    })
  )
}

export const invalidEventCharRex = /[^(\w|.|\-)]*/g

export class AnalyticsWrapper {
  client: ReturnType<typeof Analytics>
  enabled: boolean

  constructor(appName: string, plugins: any[]) {
    this.client = Analytics({
      app: appName,
      plugins,
    })

    this.enabled = false
  }

  enable() {
    this.enabled = true
  }

  track(eventName: string, payload?: Record<string, unknown>) {
    try {
      this.enabled && this.client.track(eventName, payload)
      this.enabled &&
        isSendToGTM &&
        // @ts-ignore - dataLayer is added by GTM
        window.dataLayer?.push({ event: eventName, ...payload })
    } catch (error) {
      console.error(error)
    }
  }

  // strips invalid characters
  safeTrack(eventName: string, payload?: Record<string, unknown>) {
    const clean = eventName.replace(invalidEventCharRex, "")
    this.track(clean, payload)
  }

  identify(id: string) {
    this.enabled && this.client.identify(id)
  }
}

export const analytics = new AnalyticsWrapper(appName, plugins)

if (enabled) {
  analytics.enable()
}
