import {
  HStack,
  Image,
  ModalProps,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import { ChevronRightIcon, ExternalLinkIcon } from "components/_icons"
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
      heading="Deposit / Withdraw"
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
                  /*
analytics.track("strategy.buy-sell", {
    strategyCard: cellarDataMap[id].name,
    platformSelection: `${value.name}`,
    landingType: landingType(),
});
*/
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
              href={value.url}
              key={value.name}
              onClick={() => {
                /* analytics.track("strategy.buy-sell", {
                  strategyCard: cellarDataMap[id].name,
                  platformSelection: value.name,
                  landingType: landingType(),
                })*/
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
      </Stack>
    </BaseModal>
  )
}
