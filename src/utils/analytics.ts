import Analytics from "analytics"
import googleTagManager from "@analytics/google-tag-manager"
import mixpanel from "@analytics/mixpanel"

const isBrowser = typeof window !== "undefined"

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

export const analytics = Analytics({
  app: appName,
  plugins,
})
