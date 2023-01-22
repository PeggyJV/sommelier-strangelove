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
import { strategyPageContentData } from "data/strategyPageContentData"
import htmr from "htmr"
import { useRouter } from "next/router"
import { useState, VFC } from "react"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"

interface HighlightProps {
  id: string
}

export const isValidURL = (value: string) => {
  const res = value.match(
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  )
  return res !== null
}

export const Highlight: VFC<HighlightProps> = ({ id }) => {
  const content = strategyPageContentData[id]
  const [expandHowItWorks, setExpandHowItWorks] = useState(false)
  const howItWorks = content.howItWorks.split("<br/><br/>")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

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
      <Stack spacing="40px">
        <Heading>How it Works</Heading>
        <Text maxW="40rem" color="#D9D7E0">
          {expandHowItWorks
            ? htmr(content.howItWorks)
            : howItWorks[0]}
        </Text>
        {howItWorks.length > 1 && (
          <Box>
            <SecondaryButton
              rightIcon={
                expandHowItWorks ? <BsChevronUp /> : <BsChevronDown />
              }
              onClick={() => setExpandHowItWorks(!expandHowItWorks)}
            >
              {expandHowItWorks ? "View Less" : "View More"}
            </SecondaryButton>
          </Box>
        )}
      </Stack>
      {content.backtestingText && (
        <Stack maxW="40rem" spacing="40px">
          <Heading size="lg">
            All strategies available on Sommelier marketplace are
            comprehensively backtested.
          </Heading>
          {isValidURL(content.backtestingText) ? (
            <Box>
              <SecondaryButton
                onClick={() => router.push(content.backtestingText)}
              >
                View Backtesting Data
              </SecondaryButton>
            </Box>
          ) : (
            <Box>
              <SecondaryButton onClick={onOpen}>
                View Backtesting Data
              </SecondaryButton>
              <BaseModal
                heading="Backtesting data"
                isOpen={isOpen}
                onClose={onClose}
                size="2xl"
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
