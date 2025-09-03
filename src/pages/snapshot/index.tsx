import { PageSnapshot } from "components/_pages/PageSnapshot"
import { configureGraz } from "graz"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { origin } from "utils/origin"
import { sommelierChain } from "utils/graz/chains"

configureGraz({
  chains: [sommelierChain],
})

const Snapshot: NextPage = () => {
  const { asPath } = useRouter()
  const URL = `${origin}${asPath}`

  return (
    <>
      <NextSeo
        title="Snapshot | Somm Finance"
        description="Access to risk-managed, multi-chain vaults powered by off-chain computation"
        openGraph={{
          type: "website",
          url: URL,
          site_name: "Somm Finance",
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
