import { groq } from "next-sanity"

export const sanityHomeQuery = groq`
*[_type == 'home']{
  ...,
  sectionCellars{
    title,
    subtitle,
    "protocols": protocols[]->{
      ...,
      name,
      status,
      "image": image.asset->{
        metadata,
        url,
      },
    },
    "stableCoins": stableCoins[]->{
      ...,
      name,
      "image": image.asset->{
        metadata,
        url,
      },
    },
  },
  sectionStrategies{
    title,
    subtitle,
    "strategies": strategies[]->{
      ...,
      "stableCoins": stableCoins[]->{
        ...,
        name,
        "image": image.asset->{
          metadata,
          url,
        },
      },
    }
  },
}[0]`

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
