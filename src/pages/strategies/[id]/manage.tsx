import PageCellar from "components/_pages/PageCellar"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Params } from "."

export interface CellarPageProps {
  id: string
}

const CellarPage: NextPage<CellarPageProps> = ({ id }) => {
  return <PageCellar id={id} />
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
