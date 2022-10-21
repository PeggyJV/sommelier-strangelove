import { PageStrategy } from "components/_pages/PageStrategy"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { sanityClient } from "src/lib/sanity/client"
import {
  sanityFaqQuery,
  sanityHomeQuery,
} from "src/lib/sanity/queries"
import { CustomFaqSection, HomeWithImages } from "types/sanity"

export interface CellarPageProps {
  id: string
  faqData: CustomFaqSection
  data: HomeWithImages
}

export type Params = ParsedUrlQuery & { id: string }

const CellarPage: NextPage<CellarPageProps> = ({
  id,
  faqData,
  data,
}) => {
  return <PageStrategy id={id} faqData={faqData} data={data} />
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
  // query subgraph for cellar data of given ID
  const faqData = await sanityClient.fetch(sanityFaqQuery)
  const home = await sanityClient.fetch(sanityHomeQuery)
  return { props: { id, faqData, data: home } }
}

export default CellarPage
