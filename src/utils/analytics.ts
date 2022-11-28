import Analytics from "analytics"
import googleTagManager from "@analytics/google-tag-manager"
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
const gtmAuth = process.env.NEXT_PUBLIC_GTM_AUTH
const gtmPreview = process.env.NEXT_PUBLIC_GTM_PREVIEW

const plugins = []

if (isBrowser && gtmId != null && gtmId.length > 0) {
  const config = {
    containerId: gtmId,
    auth: gtmAuth,
    preview: gtmPreview,
  }

  plugins.push(googleTagManager(config))
}

const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
if (isBrowser && mixpanelToken && mixpanelToken.length > 0) {
  plugins.push(mixpanel({ token: mixpanelToken }))
}

export const invalidEventCharRex = /[^(\w|.|\-)]*/g

export class AnalyticsWrapper {
  client: ReturnType<typeof Analytics>
  enabled: boolean
  account: string | null

  constructor(
    appName: string,
    plugins: Array<Record<string, unknown>>
  ) {
    this.client = Analytics({
      app: appName,
      plugins,
    })

    this.enabled = false
    this.account = null
  }

  enable() {
    this.enabled = true
  }

  track(eventName: string, payload?: Record<string, unknown>) {
    const eventPayload = {
      ...payload,
      account: this.account ?? "not-connected",
    }

    this.enabled && this.client.track(eventName, eventPayload)
  }

  // strips invalid characters
  safeTrack(eventName: string, payload?: Record<string, unknown>) {
    const clean = eventName.replace(invalidEventCharRex, "")
    this.track(clean, payload)
  }

  identify(id: string) {
    if (this.enabled) {
      // setting account and passing to each event instead of using cookies
      this.account = id
    }
  }
}

export const analytics = new AnalyticsWrapper(appName, plugins)

if (enabled) {
  analytics.enable()
}
