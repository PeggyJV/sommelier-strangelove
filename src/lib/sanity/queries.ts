import { groq } from "next-sanity"

export const sanityFaqQuery = groq`
*[_type == 'faqSection']{
  ...,
  "faqTabs": faqTabs[]->{
    ...,
    "faqItems": faqItems[]->{
      ...,
    }
  }
}[0]`
