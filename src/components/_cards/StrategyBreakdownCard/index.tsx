import {
  BoxProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import { VFC } from "react"
import { InnerCard } from "../InnerCard"
import { tabPanelProps, tabProps } from "./styles"
import { analytics } from "utils/analytics"
import { CellarDataMap } from "data/types"
import htmr from "htmr"
import { FAQAccordion } from "./FAQAccordion"

interface StrategyBreakdownProps extends BoxProps {
  cellarDataMap: CellarDataMap
  cellarId: string
}

export const StrategyBreakdownCard: VFC<StrategyBreakdownProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { strategyBreakdown, faq } = cellarDataMap[cellarId]

  return (
    <InnerCard pt={4} px={6} pb={8}>
      <Tabs>
        <TabList borderBottomWidth={1} borderColor="purple.dark">
          {Object.keys(strategyBreakdown).map((key) => {
            return (
              <Tab
                key={key}
                {...tabProps}
                onClick={() => {
                  const eventName = `cellar.details-selected-${key}`
                  analytics.safeTrack(eventName.toLowerCase())
                }}
              >
                {key}
              </Tab>
            )
          })}
          {faq && (
            <Tab
              key="faq"
              {...tabProps}
              onClick={() => {
                const eventName = `cellar.details-selected-faq}`
                analytics.safeTrack(eventName.toLowerCase())
              }}
            >
              FAQs
            </Tab>
          )}
        </TabList>
        <TabPanels>
          {Object.values(strategyBreakdown).map((value, i) => {
            return (
              <TabPanel key={i} {...tabPanelProps}>
                <Text whiteSpace="pre-line">{htmr(value)}</Text>
              </TabPanel>
            )
          })}
          {faq && (
            <TabPanel key={"faq"} {...tabPanelProps} maxW="none">
              <FAQAccordion data={faq} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </InnerCard>
  )
}
