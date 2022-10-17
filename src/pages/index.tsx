import PageHome from "components/_pages/PageHome"
import type { GetStaticProps, NextPage } from "next"
import { sanityClient } from "src/lib/sanity/client"
import { sanityFaqQuery } from "src/lib/sanity/queries"
import { CustomFaqSection } from "types/sanity"

export interface HomeProps {
  faqData: CustomFaqSection
}

const Home: NextPage<HomeProps> = ({ faqData }) => {
  return <PageHome faqData={faqData} />
}

export const getStaticProps: GetStaticProps = async () => {
  const faqData = await sanityClient.fetch(sanityFaqQuery)

  return {
    props: {
      faqData,
    },
  }
}

export default Home
