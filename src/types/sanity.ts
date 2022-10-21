import { Ref } from "react"
import {
  SanityBlock,
  SanityDocument,
  SanityImageAsset,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityKeyedReference,
  SanityReference,
} from "sanity-codegen"

/**
 * Home Page
 *
 *
 */
export interface Home extends SanityDocument {
  _type: "home"

  /**
   * Hero Copy — `array`
   *
   *
   */
  heroCopy?: Array<SanityKeyed<SanityBlock>>

  /**
   * Cellars Section — `sectionCellars`
   *
   *
   */
  sectionCellars?: SectionCellars

  /**
   * Strategies Section — `sectionStrategies`
   *
   *
   */
  sectionStrategies?: SectionStrategies
}

/**
 * Strategy
 *
 *
 */
export interface Strategy extends SanityDocument {
  _type: "strategy"

  /**
   * Is Active — `boolean`
   *
   *
   */
  isActive?: boolean

  /**
   * Title — `string`
   *
   *
   */
  title?: string

  /**
   * Body — `blockContent`
   *
   *
   */
  body?: BlockContent

  /**
   * Stablecoins — `array`
   *
   *
   */
  stableCoins?: Array<SanityKeyedReference<StableCoin>>
}

/**
 * Strategies Section — `sectionStrategies`
 *
 *
 */
export type SectionStrategies = {
  _type: "sectionStrategies"
  /**
   * Title — `typedTextInput`
   *
   *
   */
  title?: TypedTextInput

  /**
   * Subtitle — `string`
   *
   *
   */
  subtitle?: string

  /**
   * Strategies — `array`
   *
   *
   */
  strategies?: Array<SanityKeyedReference<Strategy>>
}

export type SectionCellars = {
  _type: "sectionCellars"
  /**
   * Title — `typedTextInput`
   *
   *
   */
  title?: TypedTextInput

  /**
   * Subtitle — `string`
   *
   *
   */
  subtitle?: string
}

export interface FaqSection extends SanityDocument {
  _type: "faqSection"

  /**
   * Title — `string`
   *
   *
   */
  title?: string

  /**
   * FAQ Tabs — `array`
   *
   *
   */
  faqTabs?: Array<SanityKeyedReference<FaqTab>>
}

/**
 * FAQ item
 *
 *
 */
export interface FaqItem extends SanityDocument {
  _type: "faqItem"

  /**
   * Question — `string`
   *
   *
   */
  question?: string

  /**
   * Answer — `array`
   *
   *
   */
  answer?: Array<SanityKeyed<SanityBlock>>
}

/**
 * FAQ Tab
 *
 *
 */
export interface FaqTab extends SanityDocument {
  _type: "faqTab"

  /**
   * Title — `string`
   *
   *
   */
  title?: string

  /**
   * FAQs — `array`
   *
   *
   */
  faqItems?: Array<SanityKeyedReference<FaqItem>>
}

/**
 * Stablecoin
 *
 *
 */
export interface StableCoin extends SanityDocument {
  _type: "stableCoin"

  /**
   * Name — `string`
   *
   *
   */
  name?: string

  /**
   * Image — `image`
   *
   *
   */
  image?: {
    _type: "image"
    asset: SanityReference<SanityImageAsset>
    crop?: SanityImageCrop
    hotspot?: SanityImageHotspot
  }
}

export type BlockContent = Array<
  | SanityKeyed<SanityBlock>
  | SanityKeyed<{
      _type: "image"
      asset: SanityReference<SanityImageAsset>
      crop?: SanityImageCrop
      hotspot?: SanityImageHotspot
    }>
  | SanityKeyed<Code>
>

export type TypedTextList = {
  _type: "typedTextList"
  /**
   * list — `array`
   *
   *
   */
  list?: Array<SanityKeyed<string>>

  /**
   * Keystroke animation duration — `number`
   *
   * Keystroke animation time in miliseconds
   */
  keyStrokeDuration?: number

  /**
   * Pause duration — `number`
   *
   * Pause time in miliseconds
   */
  pauseDuration?: number
}

export type TypedTextInput = {
  _type: "typedTextInput"
  /**
   *   — `array`
   *
   *
   */
  block?: Array<
    | SanityKeyed<SanityBlock>
    | SanityKeyed<TypedTextList>
    | SanityKeyed<LineBreak>
  >
}

export type LineBreak = {
  _type: "lineBreak"
  /**
   * style — `string`
   *
   *
   */
  style?: "lineBreak" | "horizontalBreak"
}

export interface FaqTabWithRef extends Omit<FaqTab, "faqItems"> {
  faqItems?: FaqItem[]
}

export interface CustomFaqSection
  extends Omit<FaqSection, "faqTabs"> {
  faqTabs?: FaqTabWithRef[]
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

type Code = any
