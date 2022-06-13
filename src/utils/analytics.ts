import Analytics from "analytics"
import googleTagManager from "@analytics/google-tag-manager"

const appName =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Sommelier <Local>"

// Google Tag Manager
const gtmId = process.env.NEXT_PUBLIC_GTM_ID
const gtmAuth = process.env.NEXT_PUBLIC_GTM_AUTH
const gtmPreview = process.env.NEXT_PUBLIC_GTM_PREVIEW

const plugins = []

if (gtmId != null && gtmId.length > 0) {
  const config = {
    containerId: gtmId,
    auth: gtmAuth,
    preview: gtmPreview,
  }
  console.log(config)

  plugins.push(googleTagManager(config))
}

export const analytics = Analytics({
  app: appName,
  plugins,
})
