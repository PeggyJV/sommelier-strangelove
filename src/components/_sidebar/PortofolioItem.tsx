import { StackProps, HStack, VStack, Text } from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalances } from "data/hooks/useUserBalances"
import { isStrategyUsingEth } from "data/uiConfig"
import Image from "next/image"
import { FC } from "react"
import { toEther } from "utils/formatCurrency"

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
}

export const PortofolioItem: FC<PortofolioItemProps> = ({
  icon,
  title,
  netValueUsd,
  netValueInAsset,
  tokenPrice,
  slug,
  ...props
}) => {
  const cellarData = cellarDataMap[slug]
  const { lpToken } = useUserBalances(cellarData.config)
  const { data: lpTokenData } = lpToken
  return (
    <HStack
      px={8}
      py={4}
      borderBottom="1px solid"
      borderColor="surface.secondary"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      {...props}
    >
      <HStack>
        <Image
          height={45}
          width={45}
          src={icon}
          alt="strategy icon"
        />
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
            1 token = {Number(tokenPrice.value)}{" "}
            {isStrategyUsingEth(cellarData.config)} (
            {tokenPrice.formatted})
          </Text>
        </VStack>
      </HStack>
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
  )
}
