import PagePrivacyPolicy from "components/_pages/PagePrivacyPolicy"
import type { GetStaticProps, NextPage } from "next"
import { sanityClient } from "src/lib/sanity/client"
import { sanityPrivacyPolicyQuery } from "src/lib/sanity/queries"
import { PrivacyAndTermsContent } from "types/sanity"

export interface PrivacyPolicyProps {
  data: PrivacyAndTermsContent
}

const PrivacyPolicy: NextPage<PrivacyPolicyProps> = ({ data }) => {
  return <PagePrivacyPolicy data={data} />
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await sanityClient.fetch(sanityPrivacyPolicyQuery)

  return {
    props: {
      data: data[0],
    },
  }
}

export default PrivacyPolicy
