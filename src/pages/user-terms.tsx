import PageUserTerms from "components/_pages/PageUserTerms"
import { userTermsContent } from "data/legal"
import type { NextPage } from "next"
import { PrivacyAndTermsContent } from "types/sanity"

export interface UserTermsProps {
  data: PrivacyAndTermsContent
}

const UserTerms: NextPage = () => {
  return <PageUserTerms data={userTermsContent} />
}

export default UserTerms
