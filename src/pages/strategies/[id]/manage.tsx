import PageCellar from "components/_pages/PageCellar"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Params } from "."

export interface CellarPageProps {
  id: string
}

const CellarPage: NextPage<CellarPageProps> = ({ id }) => {
  // const launchDate = cellarDataMap[id].launchDate
  // const formatedLaunchDate = launchDate ? new Date(launchDate) : null
  // const formatedDateNow = new Date(Date.now())
  // const isCountdown =
  //   formatedLaunchDate !== null
  //     ? formatedLaunchDate > formatedDateNow
  //     : false

  // if (!isCountdown || LAUNCH_DATE_DISABLED) {
  return <PageCellar id={id} />
  // }
  // return <Page404 />
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
