import {
  HStack,
  Image,
  Link,
  ModalProps,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ChevronRightIcon, ExternalLinkIcon } from "components/_icons"
import { BaseModal } from "./BaseModal"

interface BuyOrSellModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  uniswapLink?: string
  id: string
}

export const BuyOrSellModal = ({
  uniswapLink,
  id,
  ...rest
}: BuyOrSellModalProps) => {
  return (
    <BaseModal
      heading="Buy / Sell"
      headingProps={{
        fontSize: "2xl",
      }}
      {...rest}
    >
      <Stack>
        <Text>Available on</Text>
        {uniswapLink && (
          <Link href={uniswapLink} target="_blank">
            <HStack
              justifyContent="space-between"
              backgroundColor="surface.secondary"
              padding={4}
              borderRadius="xl"
            >
              <HStack spacing={4}>
                <Image
                  alt="uniswap icon"
                  src="/assets/icons/uniswap.png"
                  boxSize={6}
                />
                <Text fontSize="xl" fontWeight="bold">
                  Uniswap
                </Text>
              </HStack>
              <ExternalLinkIcon />
            </HStack>
          </Link>
        )}
        <Link href={`/strategies/${id}/manage`}>
          <HStack
            justifyContent="space-between"
            backgroundColor="surface.secondary"
            padding={4}
            borderRadius="xl"
          >
            <HStack spacing={4}>
              <Image
                alt="uniswap icon"
                src="/assets/icons/somm.png"
                boxSize={6}
              />
              <Text fontSize="xl" fontWeight="bold">
                Sommelier
              </Text>
            </HStack>
            <ChevronRightIcon />
          </HStack>
        </Link>
        <Text pt="12px" fontSize="sm" color="neutral.300">
          Token are shares of the strategy's liquidity pool and can be
          bought or sold on both Sommelier and exchanges.
        </Text>
      </Stack>
    </BaseModal>
  )
}
