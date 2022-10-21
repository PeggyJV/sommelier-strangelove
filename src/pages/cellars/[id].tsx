import PageCellar from "components/_pages/PageCellar"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"

import { ParsedUrlQuery } from "querystring"
import { cellarDataMap } from "data/cellarDataMap"
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

type Params = ParsedUrlQuery & { id: string }

const CellarPage: NextPage<CellarPageProps> = ({
  id,
  faqData,
  data,
}) => {
  return <PageCellar id={id} faqData={faqData} data={data} />
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  // query subgraph for all cellars
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
  const faqData = await sanityClient.fetch(sanityFaqQuery)
  const home = await sanityClient.fetch(sanityHomeQuery)
  const { id } = params || {}
  // query subgraph for cellar data of given ID

  return { props: { id, faqData, data: home } }
}

export default CellarPage
