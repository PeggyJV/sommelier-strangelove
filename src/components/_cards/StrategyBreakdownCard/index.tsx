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
import { FC, useEffect, useState } from "react"
import { InnerCard } from "../InnerCard"
import { tabPanelProps, tabProps } from "./styles"
import { analytics } from "utils/analytics"
import { CellarDataMap } from "data/types"
import { FAQAccordion } from "./FAQAccordion"
import parse from "html-react-parser"
import { Link } from "components/Link"
import { isValidURL } from "utils/isValidUrl"

interface StrategyBreakdownProps extends BoxProps {
  cellarDataMap: CellarDataMap
  cellarId: string
}

export const StrategyBreakdownCard: FC<StrategyBreakdownProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { strategyBreakdown, faq } = cellarDataMap[cellarId]
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  const [tabIndex, setTabIndex] = useState(0)
  const faqTabIndex = Object.keys(strategyBreakdown).length

  useEffect(() => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    const hash = url.hash?.slice(1).toLowerCase()
    const q = url.searchParams.get("faq")?.toLowerCase()
    const shouldOpen =
      hash === "faq-fees" || hash === "faq-apy" || q === "fees" || q === "apy"
    if (shouldOpen) {
      setTabIndex(faqTabIndex)
    }
  }, [faqTabIndex])

  return (
    <InnerCard
      pt={4}
      px={6}
      pb={8}
      borderRadius={{ base: 0, sm: 16 }}
    >
      <Tabs index={tabIndex} onChange={setTabIndex}>
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
                <Box whiteSpace="pre-line">{parse(value)}</Box>
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
