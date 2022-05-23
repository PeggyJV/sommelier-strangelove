import PageCellar from "components/_pages/PageCellar"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import {
  GetCellarQuery,
  GetCellarRoutesDocument,
  GetCellarRoutesQuery,
  GetCellarRouteStaticDocument,
  GetCellarRouteStaticQuery,
} from "generated/subgraph"
import { ssrClient } from "queries/client"
import { ParsedUrlQuery } from "querystring"
import { AaveV2CellarProvider } from "context/aaveV2StablecoinCellar"
import { AaveStakerProvider } from "context/aaveStakerContext"
export interface CellarPageProps {
  data: GetCellarQuery
}

type Params = ParsedUrlQuery & { id: string }

const CellarPage: NextPage<CellarPageProps> = ({ data }) => {
  return (
    <AaveV2CellarProvider>
      <AaveStakerProvider>
        <PageCellar data={data} />
      </AaveStakerProvider>
    </AaveV2CellarProvider>
  )
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  // query subgraph for all cellars
  const { data }: { data?: GetCellarRoutesQuery } = await ssrClient
    .query(GetCellarRoutesDocument)
    .toPromise()
  const { cellars } = data!

  // create array of static paths from cellars data
  const paths = cellars.map((cellar) => {
    const { id } = cellar

    return { params: { id } }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params || {}
  // query subgraph for cellar data of given ID
  const { data }: { data?: GetCellarRouteStaticQuery } =
    await ssrClient
      .query(GetCellarRouteStaticDocument, { cellarAddress: id })
      .toPromise()

  return { props: { data } }
}

export default CellarPage
