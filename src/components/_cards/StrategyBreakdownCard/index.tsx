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

interface StrategyBreakdownProps extends BoxProps {
  cellarDataMap: CellarDataMap
  cellarId: string
}

export const StrategyBreakdownCard: VFC<StrategyBreakdownProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { strategyBreakdown } = cellarDataMap[cellarId]

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
        </TabList>
        <TabPanels>
          {Object.values(strategyBreakdown).map((value, i) => {
            return (
              <TabPanel key={i} {...tabPanelProps}>
                <Text whiteSpace="pre-line">{htmr(value)}</Text>
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </InnerCard>
  )
}
