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
      placement="top"
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
            fallbackPlacements: ["top-start", "bottom", "right"],
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
        bg="neutral.800"
        border="1px solid"
        borderColor="neutral.600"
        rounded="md"
        color="neutral.100"
        fontSize="sm"
        fontFamily="var(--df-font-sans)"
        shadow="lg"
        _focus={{ outline: "none" }}
        zIndex="tooltip"
      >
        <PopoverArrow bg="neutral.800" />
        <PopoverBody px={3} py={2}>
          <Box>
            <Text fontWeight="semibold" mb={1}>
              {alphaStethI18n.netApyLabel}
            </Text>
            <Text whiteSpace="pre-line" lineHeight="short">
              {alphaStethI18n.tooltipBody}
            </Text>
            <ChakraLink
              as={NextLink}
              href={{
                pathname: "/strategies/Alpha-stETH/manage",
                query: { tab: "faqs", faq: "apy", autoscroll: "1" },
                hash: "faq-apy",
              }}
              display="inline-block"
              mt={2}
              textDecoration="underline"
              color="purple.base"
              onClick={d.onClose}
            >
              {alphaStethI18n.tooltipLinkText}
            </ChakraLink>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
