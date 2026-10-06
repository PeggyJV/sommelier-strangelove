import { PrivacyAndTermsContent } from "types/sanity"
import privacyPolicy from "./privacy-policy.json"
import userTerms from "./user-terms.json"

export const privacyPolicyContent =
  privacyPolicy as unknown as PrivacyAndTermsContent

export const userTermsContent =
  userTerms as unknown as PrivacyAndTermsContent
