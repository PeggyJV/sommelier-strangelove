import {
  SanityBlock,
  SanityDocument,
  SanityKeyed,
  SanityKeyedReference,
} from "sanity-codegen"

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

export interface FaqTabWithRef extends Omit<FaqTab, "faqItems"> {
  faqItems?: FaqItem[]
}

export interface CustomFaqSection
  extends Omit<FaqSection, "faqTabs"> {
  faqTabs?: FaqTabWithRef[]
}
