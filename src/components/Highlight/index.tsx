import {
  Box,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { BaseModal } from "components/_modals/BaseModal"
import { cellarDataMap } from "data/cellarDataMap"
import { strategyPageContentData } from "data/strategyPageContentData"
import { isUseBigBacktestingModal } from "data/uiConfig"
import htmr from "htmr"
import { useRouter } from "next/router"
import { useState } from "react"

interface HighlightProps {
  id: string
}

export const isValidURL = (value: string) => {
  const res = value.match(
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  )
  return res !== null
}

export const Highlight = ({ id }: HighlightProps) => {
  const content = strategyPageContentData[id]
  const [expandHowItWorks, setExpandHowItWorks] = useState(false)
  const howItWorks = content.howItWorks.split("<br/><br/>")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const cellarData = cellarDataMap[id]

  return (
    <Stack direction="column" mt={52} spacing="80px">
      <Stack spacing="40px">
        <Heading>Strategy Highlights</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {content.strategyHighlights.card.map((item, index) => (
            <Box
              key={index}
              bg="rgba(78, 56, 156, 0.16)"
              px={4}
              py={10}
              rounded="xl"
            >
              <Heading size="md">{item}</Heading>
            </Box>
          ))}
        </SimpleGrid>
        <Text maxW="40rem" color="#D9D7E0">
          {content.strategyHighlights.description &&
            htmr(content.strategyHighlights.description)}
        </Text>
      </Stack>
      {content.backtestingText && (
        <Stack maxW="40rem" spacing="40px">
          {isValidURL(content.backtestingText) ? (
            <Box>
              <SecondaryButton
                onClick={() => {
                  // analytics.track("strategy.view-backtesting", {
                  //   strategyCard: cellarData.name,
                  //   landingType: landingType(),
                  // })
                  router.push(content.backtestingText)
                }}
              >
                View Backtesting Data
              </SecondaryButton>
            </Box>
          ) : (
            <Box>
              <SecondaryButton
                onClick={() => {
                  // analytics.track("strategy.view-backtesting", {
                  //   strategyCard: cellarData.name,
                  //   landingType: landingType(),
                  // })
                  onOpen()
                }}
              >
                View Backtesting Data
              </SecondaryButton>
              <BaseModal
                heading="Backtesting data"
                isOpen={isOpen}
                onClose={onClose}
                size={isUseBigBacktestingModal(cellarData.config)}
              >
                {content.backtestingImage && (
                  <Image
                    src={content.backtestingImage}
                    alt="backtesting"
                  />
                )}
                <Text whiteSpace="pre-line" mt="4">
                  {htmr(content.backtestingText)}
                </Text>
              </BaseModal>
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  )
}
