import {
  Box,
  Link,
  Text,
  Tooltip,
  IconButton,
} from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import NextLink from "next/link"

export function AlphaApyTooltip() {
  return (
    <Tooltip
      hasArrow
      placement="top"
      openDelay={150}
      label={
        <Box maxW="300px">
          <Text fontWeight="semibold" mb={1}>
            Net APY
          </Text>
          <Text>
            7-day average APY after{" "}
            <Link
              as={NextLink}
              href={{
                pathname: "/strategies/Alpha-stETH/manage",
                hash: "faq-fees",
              }}
              textDecoration="underline"
            >
              fees
            </Link>
          </Text>
          <Text mt={1}>
            APY is the annual percentage yield including compounding.
          </Text>
          <Text mt={1}>
            At Alpha stETH launch, and for the first 14 days, the
            daily APY will be displayed instead of the 7-day APY due
            to insufficient historical data.
          </Text>
          <Link
            as={NextLink}
            href={{
              pathname: "/strategies/Alpha-stETH/manage",
              hash: "faq-apy",
            }}
            mt={2}
            display="inline-block"
            textDecoration="underline"
          >
            Learn more in Alpha stETH FAQ
          </Link>
        </Box>
      }
    >
      <IconButton
        aria-label="About Net APY"
        size="xs"
        variant="ghost"
        icon={<InformationIcon />}
      />
    </Tooltip>
  )
}
