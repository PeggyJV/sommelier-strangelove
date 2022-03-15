import PageCellar from 'components/_pages/PageCellar'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { GetAllCellarsDocument } from 'generated/subgraph'
import { ssrClient } from 'queries/client'
import { ParsedUrlQuery } from 'querystring'
import slugify from 'slugify'

interface Params extends ParsedUrlQuery {
  slug: string
}

const CellarPage: NextPage = () => {
  return <PageCellar />
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const { data } = await ssrClient.query(GetAllCellarsDocument).toPromise()
  const { cellars } = data
  const paths = cellars.map((cellar: any) => {
    const { name } = cellar
    const slug = slugify(name, { lower: true })

    return { params: { slug } }
  })

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params || {}

  return { props: { slug } }
}

export default CellarPage
