import PageCellar from "components/_pages/PageCellar"
import { cellarDataMap } from "data/cellarDataMap"
import { GetServerSideProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import { origin } from "utils/origin"
import { useRouter } from "next/router"
import { isComingSoon } from "utils/isComingSoon"
import { PageComingSoon } from "components/_pages/PageComingSoon"

export interface CellarPageProps {
  id: string
  blocked: boolean
}

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
        title={`${content.name} | Sommelier Finance`}
        description={content.description}
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
      <PageCellar id={id} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
}) => {
  const { id } = params || {}
  const launchDate = cellarDataMap[id as string].launchDate
  const blocked =
    isComingSoon(launchDate) &&
    process.env.NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE === "false"

  return { props: { id, blocked } }
}

export default CellarPage
