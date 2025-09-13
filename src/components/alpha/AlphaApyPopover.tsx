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
        { name: "preventOverflow", options: { padding: 12, boundary: "viewport" } },
        { name: "flip", options: { fallbackPlacements: ["top-start", "bottom", "right"] } },
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
      <PopoverContent w="320px" _focus={{ outline: "none" }} zIndex="tooltip">
        <PopoverArrow />
        <PopoverBody>
          <Box>
            <Text fontWeight="semibold" mb={1}>
              {alphaStethI18n.netApyLabel}
            </Text>
            <Text whiteSpace="pre-line">{alphaStethI18n.tooltipBody}</Text>
            <ChakraLink
              as={NextLink}
              href={{ pathname: "/strategies/Alpha-stETH/manage", hash: "faq-apy" }}
              display="inline-block"
              mt={2}
              textDecoration="underline"
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


