import {
  BoxProps,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import { CellarDataMap } from "data/cellarDataMap"
import { VFC } from "react"
import { InnerCard } from "../InnerCard"
import { tabPanelProps, tabProps } from "./styles"
import { analytics } from "utils/analytics"

interface StrategyBreakdownProps extends BoxProps {
  cellarDataMap: CellarDataMap
  cellarId: string
}

export const StrategyBreakdownCard: VFC<StrategyBreakdownProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { strategyBreakdown, strategyImgSrc } =
    cellarDataMap[cellarId]

  return (
    <InnerCard pt={4} px={6} pb={8}>
      <Tabs>
        <TabList borderBottomWidth={1} borderColor="purple.base">
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
                <Text whiteSpace="pre-line">{value}</Text>
                {strategyImgSrc && i === 1 && (
                  <Image src={strategyImgSrc} alt="" mt={4} />
                )}
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </InnerCard>
  )
}
