import {
  BoxProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import TransparentCard from "../TransparentCard"
import { tabPanelProps, tabProps } from "./styles"

const StrategyBreakdownCard: VFC<BoxProps> = () => {
  return (
    <TransparentCard>
      <CardHeading pb={4}>strategy breakdown</CardHeading>
      <Tabs>
        <TabList borderColor="rgba(203, 198, 209, 0.25)">
          <Tab {...tabProps}>Goals</Tab>
          <Tab {...tabProps}>Strategy</Tab>
          <Tab {...tabProps}>Somm Alpha</Tab>
        </TabList>
        <TabPanels>
          <TabPanel {...tabPanelProps}>
            <Text>
              The Aave stablecoin strategy aims to select the optimal
              stablecoin lending position available to lend across
              Aave markets on a continuous basis. The goal is to
              outperform a static strategy of lending any single
              stablecoin. Returns are amplified for Sommelier users as
              they will not suffer opportunity costs from passively
              sitting in less profitable lending positions at any
              given moment.
            </Text>
          </TabPanel>
          <TabPanel {...tabPanelProps}>
            <Text>
              This strategy involves observation of several variables
              including Aave interest rates, rate volatility, gas
              fees, slippage estimations, and TVL. This data is the
              input for a custom predictive model which recommends
              position adjustments periodically. The entire process is
              automated as the model delivers a feed to Sommelier
              validators who relay necessary function calls to the
              Cellar.
            </Text>
          </TabPanel>
          <TabPanel {...tabPanelProps}>
            <Text>
              The alpha Somm delivers for this Strategy is generated
              by our Data Scientists & Quants. They are the
              masterminds behind the brilliant model that determines
              the precise moment that is best to capitalize on new
              market conditions. Their edge is compounded by Somm's
              unique ability to dynamically adjust in real time.
              Unlike traditional vault architecture, Cellars are not
              limited by rigid smart contract code that allows
              positions to be adjusted under a narrow set of
              circumstances. The Aave Strategy uses high-powered
              predictive analytics to respond instantly when
              opportunity arises. The old vault model is a tortoise
              that pokes its head out of its shell occasionally when
              conditions are safe. We are cheetahs on the savannah.
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </TransparentCard>
  )
}

export default StrategyBreakdownCard
