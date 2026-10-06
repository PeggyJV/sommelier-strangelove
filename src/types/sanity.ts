import { Ref } from "react"
import { PortableTextBlock } from "@portabletext/types"

export type Keyed<T> = T & { _key: string }

export interface ContentDocument {
  _id: string
  _type: string
  _createdAt?: string
  _updatedAt?: string
  _rev?: string
}

export interface ContentReference<T> {
  _key?: string
  _ref: string
  _type: "reference"
  _target?: T
}

export interface ContentImage {
  _type: "image"
  asset: ContentReference<ContentImageAsset>
  crop?: {
    _type?: string
    top: number
    bottom: number
    left: number
    right: number
  }
  hotspot?: {
    _type?: string
    x: number
    y: number
    height: number
    width: number
  }
}

export interface ContentImageAsset extends ContentDocument {
  _type: "sanity.imageAsset"
  url?: string
  metadata?: Record<string, unknown>
}

export interface Home extends ContentDocument {
  _type: "home"
  heroCopy?: Array<Keyed<PortableTextBlock>>
  sectionCellars?: SectionCellars
  sectionStrategies?: SectionStrategies
}

export interface Strategy extends ContentDocument {
  _type: "strategy"
  isActive?: boolean
  title?: string
  body?: BlockContent
  stableCoins?: Array<ContentReference<StableCoin>>
}

export type SectionStrategies = {
  _type: "sectionStrategies"
  title?: TypedTextInput
  subtitle?: string
  strategies?: Array<ContentReference<Strategy>>
}

export type SectionCellars = {
  _type: "sectionCellars"
  title?: TypedTextInput
  subtitle?: string
}

export interface FaqSection extends ContentDocument {
  _type: "faqSection"
  title?: string
  faqTabs?: Array<ContentReference<FaqTab>>
}

export interface FaqItem extends ContentDocument {
  _type: "faqItem"
  question?: string
  answer?: Array<Keyed<PortableTextBlock>>
}

export interface FaqTab extends ContentDocument {
  _type: "faqTab"
  title?: string
  faqItems?: Array<ContentReference<FaqItem>>
}

export interface StableCoin extends ContentDocument {
  _type: "stableCoin"
  name?: string
  image?: ContentImage
}

type Code = {
  _type: "code"
  [key: string]: unknown
}

export type BlockContent = Array<
  | Keyed<PortableTextBlock>
  | Keyed<ContentImage>
  | Keyed<Code>
>

export type TypedTextList = {
  _type: "typedTextList"
  list?: string[]
  keyStrokeDuration?: number
  pauseDuration?: number
}

export type TypedTextInput = {
  _type: "typedTextInput"
  block?: Array<
    | Keyed<PortableTextBlock>
    | Keyed<TypedTextList>
    | Keyed<LineBreak>
  >
}

export type LineBreak = {
  _type: "lineBreak"
  style?: "lineBreak" | "horizontalBreak"
}

export interface FaqTabWithRef extends Omit<FaqTab, "faqItems"> {
  faqItems?: FaqItem[]
}

export interface CustomFaqSection
  extends Omit<FaqSection, "faqTabs"> {
  faqTabs?: FaqTabWithRef[]
}

export interface PrivacyAndTermsContent extends ContentDocument {
  _type: "privacyPolicy" | "userTerms"
  content: BlockContent
}

export interface StableCoinWithImage
  extends Omit<StableCoin, "image"> {
  image?: {
    url: string
  }
}

interface SectionRef {
  sectionRef?: Ref<HTMLDivElement>
}

export interface SectionCellarsWithImage extends SectionCellars {}

export interface StrategyWithImage
  extends Omit<Strategy, "stableCoins"> {
  stableCoins?: StableCoinWithImage[]
}

export interface SectionStrategiesWithImages
  extends Omit<SectionStrategies, "strategies">,
    SectionRef {
  strategies?: StrategyWithImage[]
}

export interface HomeWithImages
  extends Omit<Home, "sectionCellars" | "sectionStrategies"> {
  sectionCellars: SectionCellarsWithImage
  sectionStrategies: SectionStrategiesWithImages
}
