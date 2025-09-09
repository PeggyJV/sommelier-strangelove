import dynamic from "next/dynamic"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import { ParsedUrlQuery } from "querystring"
import { origin } from "utils/origin"
import { useRouter } from "next/router"
import { isComingSoon } from "utils/isComingSoon"
import { PageComingSoon } from "components/_pages/PageComingSoon"

export interface CellarPageProps {
  id: string
  blocked: boolean
}

export type Params = ParsedUrlQuery & { id: string }

// Defer heavy client-only modules (charts, d3, viem ENS, etc.) to the browser
const PageCellar = dynamic(
  () => import("components/_pages/PageCellar"),
  {
    ssr: false,
    loading: () => null,
  }
)

const CellarPage: NextPage<CellarPageProps> = ({ id, blocked }) => {
  const router = useRouter()
  if (blocked) {
    return <PageComingSoon />
  }
  const content = cellarDataMap[id]
  const URL = `${origin}${router.asPath}`
  return (
    <>
      <NextSeo
        title={`${content.name} | Somm Finance`}
        description={content.description}
        openGraph={{
          type: "website",
          url: URL,
          site_name: "Somm Finance",
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
      <PageCellar id={id} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const cellars = Object.keys(cellarDataMap)
  const paths = cellars.map((cellar) => {
    return { params: { id: cellar } }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params || {}
  const launchDate = cellarDataMap[id as string].launchDate
  const blocked =
    isComingSoon(launchDate) &&
    process.env.NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE === "false"

  // prefetch and cache the data
  return {
    props: {
      id,
      blocked,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export default CellarPage
