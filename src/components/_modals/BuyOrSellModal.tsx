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
  exchange?: {
    url?: string
    name: string
    logo: string
  }[]
  id: string
}

export const BuyOrSellModal = ({
  exchange,
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
        {exchange?.map((value) => {
          if (!value.url) {
            return (
              <Link
                key={value.name}
                href={`/strategies/${id}/manage`}
                onClick={() => {
                  analytics.track("strategy.buy-sell", {
                    strategyCard: cellarDataMap[id].name,
                    platformSelection: `${value.name}`,
                    landingType: landingType(),
                  })
                }}
                textDecoration="none"
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
                      src={value.logo}
                      boxSize={6}
                    />
                    <Text fontSize="xl" fontWeight="bold">
                      {value.name}
                    </Text>
                  </HStack>
                  <ChevronRightIcon />
                </HStack>
              </Link>
            )
          }
          return (
            <Link
              href={value.name}
              key={value.name}
              onClick={() => {
                analytics.track("strategy.buy-sell", {
                  strategyCard: cellarDataMap[id].name,
                  platformSelection: value.name,
                  landingType: landingType(),
                })
              }}
              target="_blank"
              textDecoration="none"
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
                    alt={value.name}
                    src={value.logo}
                    boxSize={6}
                  />
                  <Text fontSize="xl" fontWeight="bold">
                    {value.name}
                  </Text>
                </HStack>
                <ExternalLinkIcon />
              </HStack>
            </Link>
          )
        })}
        <Text pt="12px" fontSize="sm" color="neutral.300">
          Token are shares of the strategy's liquidity pool and can be
          bought or sold on both Sommelier and exchanges.
        </Text>
      </Stack>
    </BaseModal>
  )
}
