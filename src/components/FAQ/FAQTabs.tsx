import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import { InnerCard } from "components/_cards/InnerCard"
import { tabProps } from "components/_cards/StrategyBreakdownCard/styles"
import { FaqTabWithRef } from "types/sanity"
import { analytics } from "utils/analytics"
import { FAQAccordion } from "./FAQAccordion"

interface FAQTabsProps {
  data?: FaqTabWithRef[]
}

const whitespaceRex = /\s/g

const FAQTabs: React.FC<FAQTabsProps> = ({ data }) => {
  return (
    <InnerCard pt={4} px={6} pb={8}>
      <Tabs>
        <TabList borderBottomWidth={1} borderColor="purple.base">
          {data?.map((faqTab) => {
            return (
              <Tab
                key={faqTab._id}
                {...tabProps}
                onClick={() => {
                  analytics.safeTrack(
                    `click.faq-${faqTab?.title
                      ?.replace(whitespaceRex, "-")
                      ?.toLowerCase()}`
                  )
                }}
              >
                {faqTab.title}
              </Tab>
            )
          })}
        </TabList>
        <TabPanels>
          {data?.map((faqTab) => {
            return (
              <TabPanel key={faqTab._id}>
                <FAQAccordion data={faqTab.faqItems} />
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </InnerCard>
  )
}

export default FAQTabs
