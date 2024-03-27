import { PageSnapshot } from "components/_pages/PageSnapshot"
import { configureGraz, GrazChain, mainnetChains } from "graz"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { origin } from "utils/origin"

const chain: GrazChain = {
  ...mainnetChains.sommelier,
  rpc: "https://sommelier-rpc.polkachu.com/",
  rest: "https://sommelier-api.polkachu.com/",
}

configureGraz({
  defaultChain: chain,
})

const Snapshot: NextPage = () => {
  const { asPath } = useRouter()
  const URL = `${origin}${asPath}`

  return (
    <>
      <NextSeo
        title="Snapshot | Sommelier Finance"
        description="Access to risk-managed, multi-chain vaults powered by off-chain computation"
        openGraph={{
          type: "website",
          url: URL,
          site_name: "Sommelier Finance",
          images: [
            {
              url: "https://app.sommelier.finance/ogimage.png",
              width: 1200,
              height: 630,
              alt: "Your dynamic DeFi vault connoisseur",
            },
          ],
        }}
        twitter={{
          handle: "@sommfinance",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <PageSnapshot />
    </>
  )
}

export default Snapshot
