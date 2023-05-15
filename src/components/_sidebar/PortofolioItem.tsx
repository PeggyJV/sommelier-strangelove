import {
  StackProps,
  HStack,
  VStack,
  Text,
  Stack,
  Box,
  Tooltip,
} from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalances } from "data/hooks/useUserBalances"
import { isStrategyUsingEth } from "data/uiConfig"
import Image from "next/image"
import { useRouter } from "next/router"
import { FC } from "react"
import { toEther } from "utils/formatCurrency"
import { DIRECT, landingType } from "utils/landingType"
import { analytics } from "utils/analytics"

interface PortofolioItemProps extends StackProps {
  icon: string
  title: string
  netValueUsd: string
  netValueInAsset: string
  tokenPrice: {
    value: number | string
    formatted: string
  }
  slug: string
  description: string
}

export const PortofolioItem: FC<PortofolioItemProps> = ({
  icon,
  title,
  netValueUsd,
  netValueInAsset,
  tokenPrice,
  slug,
  description,
  ...props
}) => {
  console.log(netValueInAsset)
  const cellarData = cellarDataMap[slug]
  const { lpToken } = useUserBalances(cellarData.config)
  const { data: lpTokenData } = lpToken
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
      shouldWrapChildren
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
          router.push(`strategies/${slug}`)
          const landingTyp = landingType()
          analytics.track("strategy.selection", {
            strategyCard: name,
            landingType: landingType(),
          })
          if (landingTyp === DIRECT) {
            analytics.track("strategy.selection.direct", {
              strategyCard: name,
              landingType: landingTyp,
            })
          } else {
            analytics.track("strategy.selection.indirect", {
              strategyCard: name,
              landingType: landingTyp,
            })
          }
        }}
        {...props}
      >
        <Stack direction="row">
          <Box>
            <Image
              height={45}
              width={45}
              src={icon}
              alt="strategy icon"
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
                  lpTokenData.formatted,
                  lpTokenData.decimals,
                  true,
                  2
                )} Tokens`}
            </Text>
            <Text fontWeight={500} fontSize={12} color="neutral.400">
              1 token = {Number(tokenPrice.value).toFixed(3)}{" "}
              {isStrategyUsingEth(cellarData.config)} (
              {tokenPrice.formatted})
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
            {netValueInAsset}
          </Text>
        </VStack>
      </HStack>
    </Tooltip>
  )
}
