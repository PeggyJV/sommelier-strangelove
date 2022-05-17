import {
  BoxProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import { CellarDataMap } from "data/cellarDataMap"
import { VFC } from "react"
import TransparentCard from "../TransparentCard"
import { tabPanelProps, tabProps } from "./styles"

interface StrategyBreakdownProps extends BoxProps {
  cellarDataMap: CellarDataMap
  cellarId: string
}

const StrategyBreakdownCard: VFC<StrategyBreakdownProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { strategyBreakdown } = cellarDataMap[cellarId]

  return (
    <TransparentCard>
      <Tabs>
        <TabList borderBottomWidth={1} borderColor="purple.base">
          {Object.keys(strategyBreakdown).map((key) => {
            return (
              <Tab key={key} {...tabProps}>
                {key}
              </Tab>
            )
          })}
        </TabList>
        <TabPanels>
          {Object.values(strategyBreakdown).map((value, i) => {
            return (
              <TabPanel key={i} {...tabPanelProps}>
                <Text>{value}</Text>
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </TransparentCard>
  )
}

export default StrategyBreakdownCard
