import {
  // ... (other imports)
  Box,
  BoxProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useMediaQuery,
} from "@chakra-ui/react"
import { VFC } from "react"
import { InnerCard } from "../InnerCard"
import { tabPanelProps, tabProps } from "./styles"
import { analytics } from "utils/analytics"
import { CellarDataMap } from "data/types"
import { FAQAccordion } from "./FAQAccordion"
import htmr from "htmr"
import { Link } from "components/Link"
import { isValidURL } from "utils/isValidUrl"

interface StrategyBreakdownProps extends BoxProps {
  cellarDataMap: CellarDataMap
  cellarId: string
}

export const StrategyBreakdownCard: VFC<StrategyBreakdownProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { strategyBreakdown, faq } = cellarDataMap[cellarId]
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  return (
    <InnerCard
      pt={4}
      px={6}
      pb={8}
      borderRadius={{ base: 0, sm: 16 }}
    >
      <Tabs>
        <TabList
          borderBottomWidth={1}
          borderColor="purple.dark"
          overflowX={isMobile ? "auto" : "hidden"}
          overflowY={isMobile ? "hidden" : "visible"}
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
        >
          {Object.keys(strategyBreakdown).map((key) => {
            return (
              <Tab
                key={key}
                {...tabProps}
                onClick={() => {
                  const eventName = `cellar.details-selected-${key}`
                  analytics.safeTrack(eventName.toLowerCase())
                }}
                width={isMobile ? "100%" : "auto"}
                flex={isMobile ? "none" : "0 0 auto"}
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
              width={isMobile ? "100%" : "auto"}
              flex={isMobile ? "none" : "0 0 auto"}
            >
              FAQs
            </Tab>
          )}
        </TabList>
        <TabPanels>
          {Object.values(strategyBreakdown).map((value, i) => {
            if (isValidURL(value)) {
              return (
                <TabPanel key={i} {...tabPanelProps}>
                  <Text>
                    Read more about backtesting{" "}
                    <Link href={value} textDecor="underline">
                      here
                    </Link>
                  </Text>
                </TabPanel>
              )
            }
            return (
              <TabPanel key={i} {...tabPanelProps}>
                <Box whiteSpace="pre-line">{htmr(value)}</Box>
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
