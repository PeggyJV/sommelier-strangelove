import {
  Box,
  Link,
  Text,
  Tooltip,
  IconButton,
} from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import NextLink from "next/link"

export function AlphaApyTooltip({ children }: { children?: React.ReactNode }) {
  return (
    <Tooltip
      hasArrow
      placement="right"
      gutter={10}
      openDelay={120}
      closeOnScroll
      portalProps={{ appendToParentPortal: false }}
      modifiers={[
        {
          name: "preventOverflow",
          options: { padding: 12, boundary: "viewport" },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["right-start", "bottom", "top"],
          },
        },
        { name: "offset", options: { offset: [0, 8] } },
      ]}
      zIndex="tooltip"
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
      {children ?? (
        <IconButton
          aria-label="About Net APY"
          size="xs"
          variant="ghost"
          icon={<InformationIcon />}
        />
      )}
    </Tooltip>
  )
}
