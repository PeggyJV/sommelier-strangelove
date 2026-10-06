import PagePrivacyPolicy from "components/_pages/PagePrivacyPolicy"
import { privacyPolicyContent } from "data/legal"
import type { NextPage } from "next"
import { PrivacyAndTermsContent } from "types/sanity"

export interface PrivacyPolicyProps {
  data: PrivacyAndTermsContent
}

const PrivacyPolicy: NextPage = () => {
  return <PagePrivacyPolicy data={privacyPolicyContent} />
}

export default PrivacyPolicy
