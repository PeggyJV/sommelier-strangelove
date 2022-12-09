import {
  HStack,
  Image,
  Link,
  ModalProps,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ChevronRightIcon, ExternalLinkIcon } from "components/_icons"
import { cellarDataMap } from "data/cellarDataMap"
import { analytics } from "utils/analytics"
import { landingType } from "utils/landingType"
import { BaseModal } from "./BaseModal"

interface BuyOrSellModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  uniswapLink?: string
  injectiveLink?: string
  id: string
}

export const BuyOrSellModal = ({
  uniswapLink,
  injectiveLink,
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
        <Text
          textTransform="capitalize"
          color="neutral.300"
          fontSize="0.625rem"
        >
          Available on
        </Text>
        <Link
          href={`/strategies/${id}/manage`}
          onClick={() => {
            analytics.track("strategy.buy-sell", {
              strategyCard: cellarDataMap[id].name,
              platformSelection: "Sommelier",
              landingType: landingType(),
            })
          }}
          style={{ textDecoration: "none" }}
        >
          <HStack
            justifyContent="space-between"
            backgroundColor="surface.secondary"
            padding={4}
            borderRadius="xl"
            _hover={{
              backgroundColor: "purple.dark",
            }}
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
        {uniswapLink && (
          <Link
            href={uniswapLink}
            onClick={() => {
              analytics.track("strategy.buy-sell", {
                strategyCard: cellarDataMap[id].name,
                platformSelection: "Uniswap",
                landingType: landingType(),
              })
            }}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <HStack
              justifyContent="space-between"
              backgroundColor="surface.secondary"
              padding={4}
              borderRadius="xl"
              _hover={{
                backgroundColor: "purple.dark",
              }}
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

        {injectiveLink && (
          <Link
            href={injectiveLink}
            onClick={() => {
              analytics.track("strategy.buy-sell", {
                strategyCard: cellarDataMap[id].name,
                platformSelection: "Uniswap",
                landingType: landingType(),
              })
            }}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <HStack
              justifyContent="space-between"
              backgroundColor="surface.secondary"
              padding={4}
              borderRadius="xl"
              _hover={{
                backgroundColor: "purple.dark",
              }}
            >
              <HStack spacing={4}>
                <Image
                  alt="injective icon"
                  src="/assets/icons/injective.png"
                  boxSize={6}
                />
                <Text fontSize="xl" fontWeight="bold">
                  Injective
                </Text>
              </HStack>
              <ExternalLinkIcon />
            </HStack>
          </Link>
        )}
        <Text pt="12px" fontSize="sm" color="neutral.300">
          Token are shares of the strategy's liquidity pool and can be
          bought or sold on both Sommelier and exchanges.
        </Text>
      </Stack>
    </BaseModal>
  )
}
