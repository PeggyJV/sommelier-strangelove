import { Page404 } from "components/_pages/Page404"
import { PageBridge } from "components/_pages/PageBridge"
import {
  configureGraz,
  GrazChain,
  GrazProvider,
  mainnetChains,
} from "graz"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { BRIDGE_PAGE_ENABLED } from "utils/constants"
import { origin } from "utils/origin"
const chain: GrazChain = {
  ...mainnetChains.sommelier,
  rpc: "https://rpc.sommelier.strange.love/",
  rest: "https://api.sommelier.strange.love/",
}

configureGraz({
  defaultChain: chain,
})

const Bridge: NextPage = () => {
  const { asPath } = useRouter()
  const URL = `${origin}${asPath}`

  return (
    <>
      <NextSeo
        title="Bridge | Sommelier Finance"
        description="Access to risk-managed, multi chain strategies powered by off-chain computation"
        openGraph={{
          type: "website",
          url: URL,
          site_name: "Sommelier Finance",
          images: [
            {
              url: "https://app.sommelier.finance/ogimage.png",
              width: 1200,
              height: 630,
              alt: "Your dynamic DeFi strategy connoisseur",
            },
          ],
        }}
        twitter={{
          handle: "@sommfinance",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />

      <GrazProvider>
        {BRIDGE_PAGE_ENABLED ? <PageBridge /> : <Page404 />}
      </GrazProvider>
    </>
  )
}

export default Bridge
