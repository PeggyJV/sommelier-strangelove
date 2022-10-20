import { PageStrategy } from "components/_pages/PageStrategy"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"

export interface CellarPageProps {
  id: string
}

export type Params = ParsedUrlQuery & { id: string }

const CellarPage: NextPage<CellarPageProps> = ({ id }) => {
  return <PageStrategy id={id} />
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

  return { props: { id } }
}

export default CellarPage
