import {
  StackProps,
  HStack,
  VStack,
  Text,
  Stack,
  Box,
  Tooltip,
  Img,
} from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalance } from "data/hooks/useUserBalance"
import { useRouter } from "next/router"
import { FC } from "react"
import { formatUSD, toEther } from "utils/formatCurrency"
import { DIRECT, landingType } from "utils/landingType"
import { useCoinGeckoPrice } from "data/hooks/useCoinGeckoPrice"
import { showNetValueInAsset } from "data/uiConfig"
import { tokenConfig } from "data/tokenConfig"

interface PortofolioItemProps extends StackProps {
  icon: string
  title: string
  netValueUsd: string
  netValueInAsset: number
  tokenPrice: {
    value: number | string
    formatted: string
  }
  bondedToken: number
  slug: string
  description: string
  symbol: string
}

export const PortofolioItem: FC<PortofolioItemProps> = ({
  icon,
  title,
  netValueUsd,
  netValueInAsset,
  tokenPrice,
  slug,
  description,
  bondedToken,
  symbol,
  ...props
}) => {
  const cellarData = cellarDataMap[slug]

  const { lpToken } = useUserBalance(cellarData.config)
  const { data: lpTokenData } = lpToken

  const baseAsset = tokenConfig.find(
    (token) => token.symbol === symbol && cellarData.config.chain.id === token.chain
  )!

  const { data: coinGeckoPrice, error } = useCoinGeckoPrice(
    baseAsset
  )

  const router = useRouter()
  return (
    <Tooltip
      label={description}
      color="neutral.100"
      border="0"
      fontSize="12px"
      bg="neutral.900"
      py="4"
      px="6"
      top={-4}
      boxShadow="xl"
      shouldWrapChildren={false}
    >
      <HStack
        px={8}
        py={4}
        _notLast={{
          borderBottom: "1px solid",
          borderColor: "surface.secondary",
        }}
        _hover={{
          bg: "surface.secondary",
        }}
        borderBottom="1px solid"
        borderColor="surface.secondary"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        onClick={() => {
          router.push(`strategies/${slug}/manage`)
          const landingTyp = landingType()
          // analytics.track("strategy.selection", {
          //   strategyCard: name,
          //   landingType: landingType(),
          // })
          if (landingTyp === DIRECT) {
            /*  analytics.track("strategy.selection.direct", {
              strategyCard: name,
              landingType: landingTyp,
            })*/
          } else {
            /* analytics.track("strategy.selection.indirect", {
              strategyCard: name,
              landingType: landingTyp,
            })*/
          }
        }}
        {...props}
      >
        <Stack direction="row">
          <Box>
            <Img
              height={"2.5em"}
              width={"2.5em"}
              src={icon}
              alt="strategy icon"
              borderRadius="50%"
            />
          </Box>
          <VStack
            spacing={0}
            h="100%"
            alignSelf="baseline"
            alignItems="flex-start"
          >
            <Text as="h6" fontSize={16} fontWeight={700}>
              {title}
            </Text>
            <Text fontWeight={500} fontSize={12} color="neutral.400">
              {lpTokenData &&
                `${toEther(
                  lpTokenData?.value + BigInt(bondedToken),
                  lpTokenData?.decimals,
                  true,
                  2
                ).toLocaleString()} Tokens`}
            </Text>
            <Text fontWeight={500} fontSize={12} color="neutral.400">
              1 token = {Number(tokenPrice.value).toFixed(3)} {symbol}{" "}
              ({formatUSD(coinGeckoPrice?.toString(), 4)})
            </Text>
          </VStack>
        </Stack>
        <VStack
          spacing={0}
          h="100%"
          alignSelf="baseline"
          alignItems="flex-end"
          textAlign="right"
        >
          <Text as="h6" fontSize={16} fontWeight={700}>
            {netValueUsd}
          </Text>
          <Text fontWeight={500} fontSize={12} color="neutral.400">
            {(netValueInAsset).toFixed(
              showNetValueInAsset(cellarData.config) ? 5 : 2
            )}
            {` ${symbol}`}
          </Text>
        </VStack>
      </HStack>
    </Tooltip>
  )
}
