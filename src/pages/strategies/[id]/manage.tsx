import PageCellar from "components/_pages/PageCellar"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import { Params } from "."
import { origin } from "utils/origin"
import { useRouter } from "next/router"

export interface CellarPageProps {
  id: string
}

const CellarPage: NextPage<CellarPageProps> = ({ id }) => {
  const router = useRouter()
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

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const cellars = Object.keys(cellarDataMap)

  // create array of static paths from cellars data
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

  return { props: { id } }
}

export default CellarPage
