import PageUserTerms from "components/_pages/PageUserTerms"
import type { GetStaticProps, NextPage } from "next"
import { sanityClient } from "src/lib/sanity/client"
import { sanityUserTermsQuery } from "src/lib/sanity/queries"
import { PrivacyAndTermsContent } from "types/sanity"

export interface UserTermsProps {
  data: PrivacyAndTermsContent
}

const UserTerms: NextPage<UserTermsProps> = ({ data }) => {
  return <PageUserTerms data={data} />
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await sanityClient.fetch(sanityUserTermsQuery)

  return {
    props: {
      data: data[0],
    },
  }
}

export default UserTerms
