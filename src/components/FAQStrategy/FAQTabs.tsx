import {
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import { FaqTabWithRef } from "types/sanity"
import { analytics } from "utils/analytics"
import { FAQAccordion } from "./FAQAccordion"

interface FAQTabsProps {
  data?: FaqTabWithRef[]
}

const whitespaceRex = /\s/g

export const FAQTabs: React.FC<FAQTabsProps> = ({
  data,
  ...rest
}) => {
  return (
    <Tabs variant="soft-rounded" {...rest}>
      <TabList mb={6} py={{ base: 4 }} overflowX="auto">
        {data?.map((faqTab) => (
          <Tab
            key={faqTab._id}
            color="neutral.400"
            flexShrink="0"
            fontSize="xl"
            _selected={{ color: "neutral.100", bg: "purple.base" }}
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
        ))}
      </TabList>

      <TabPanels>
        {data?.map((faqTab) => {
          return (
            <TabPanel key={faqTab._id} px={0}>
              <FAQAccordion data={faqTab.faqItems} />
            </TabPanel>
          )
        })}
      </TabPanels>
    </Tabs>
  )
}
