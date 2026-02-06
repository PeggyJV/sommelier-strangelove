import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Box,
  Text,
  Link as ChakraLink,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { InformationIcon } from "components/_icons"
import { alphaStethI18n } from "i18n/alphaSteth"

export function AlphaApyPopover() {
  const d = useDisclosure()

  return (
    <Popover
      isOpen={d.isOpen}
      onOpen={d.onOpen}
      onClose={d.onClose}
      placement="top-start"
      closeOnBlur
      returnFocusOnClose
      isLazy
      modifiers={[
        {
          name: "preventOverflow",
          options: { padding: 12, boundary: "viewport" },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top-start", "bottom-start", "right-start", "left-start"],
          },
        },
        { name: "offset", options: { offset: [0, 8] } },
      ]}
    >
      <PopoverTrigger>
        <IconButton
          aria-label="About Net APY"
          size="xs"
          variant="ghost"
          icon={<InformationIcon />}
          onMouseEnter={d.onOpen}
          onFocus={d.onOpen}
          onClick={d.onOpen}
        />
      </PopoverTrigger>
      <PopoverContent
        w="320px"
        maxW="calc(100vw - 24px)"
        bg="surface.bg"
        color="neutral.300"
        borderWidth="1px"
        borderColor="purple.base"
        rounded={8}
        shadow="lg"
        overflow="hidden"
        boxSizing="border-box"
        _focus={{ outline: "none" }}
        zIndex="tooltip"
        pointerEvents="auto"
      >
        <PopoverArrow bg="surface.bg" />
        <PopoverBody
          px={3}
          py={2}
          sx={{ wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "normal" }}
        >
          <Box>
            <Text fontWeight="semibold" mb={1}>
              {alphaStethI18n.netApyLabel}
            </Text>
            <Text lineHeight="short">
              7-day average APY after{" "}
              <ChakraLink
                as={NextLink}
                href="/strategies/Alpha-stETH/manage?tab=faqs&faq=fees&autoscroll=1#faq-fees"
                textDecoration="underline"
                onClick={(_e) => {
                  try {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("alpha-faq-autoscroll", "1")
                      localStorage.setItem("alpha-faq-target", "fees")
                    }
                  } catch {}
                  d.onClose()
                }}
              >
                fees
              </ChakraLink>
            </Text>
            <Text mt={1} lineHeight="short">
              APY is the annual percentage yield including
              compounding.
            </Text>
            <Text mt={1} lineHeight="short">
              At Alpha stETH launch, and for the first 14 days, the
              daily APY will be displayed instead of the 7-day APY due
              to insufficient historical data.
            </Text>
            <ChakraLink
              as={NextLink}
              href="/strategies/Alpha-stETH/manage?tab=faqs&faq=apy&autoscroll=1#faq-apy"
              display="inline-block"
              mt={2}
              textDecoration="underline"
              onClick={(_e) => {
                try {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("alpha-faq-autoscroll", "1")
                    localStorage.setItem("alpha-faq-target", "apy")
                  }
                } catch {}
                d.onClose()
              }}
            >
              {alphaStethI18n.tooltipLinkText}
            </ChakraLink>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
