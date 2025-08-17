import { useQuery } from "@tanstack/react-query"
import { getUserDataWithContracts } from "data/actions/common/getUserData"
import { cellarDataMap } from "data/cellarDataMap"
import { useAccount } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { useStrategyData } from "./useStrategyData"
import { useUserBalance } from "./useUserBalance"
import { tokenConfig } from "data/tokenConfig"
import { formatUSD } from "utils/formatCurrency"
import { showNetValueInAsset } from "data/uiConfig"

export const useUserStrategyData = (
  strategyAddress: string,
  chain: string
) => {
  const { address: userAddress } = useAccount()
  const { data: allContracts } = useAllContracts()
  const strategyData = useStrategyData(strategyAddress, chain)
  const sommToken = tokenConfig.find(
    (token) =>
      token.coinGeckoId === "sommelier" && token.chain === chain
  )!

  const sommPrice = useCoinGeckoPrice(sommToken)

  const config = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
        strategyAddress.toLowerCase() &&
      item.config.chain.id === chain
  )!.config

  const isNoDataSource = Boolean(
    Object.values(cellarDataMap).find(
      (item) =>
        item.config.cellar.address === strategyAddress &&
        item.config.chain.id === chain
    )?.config.isNoDataSource
  )
  const { lpToken } = useUserBalance(config)
  const baseAsset = config.baseAsset
  const { data: baseAssetPrice } = useCoinGeckoPrice(baseAsset)

  // if chain is not ethereum, key format is '{address}-{chain}', otherwise it is '{address}'
  const key =
    strategyAddress +
    (config.chain.id !== "ethereum" ? "-" + chain : "")
  const query = useQuery({
    queryKey: ["USE_USER_DATA", strategyAddress, chain, userAddress],
    queryFn: async () => {
      // Use the LP token data from useUserBalance instead of contract calls
      const lpTokenData = lpToken.data

      if (!lpTokenData || !strategyData.data) {
        return {
          userStrategyData: {
            userData: {
              netValue: { formatted: "0", value: 0 },
              shares: { formatted: "0", value: 0n },
              stakedShares: { formatted: "0", value: 0n },
              ...(showNetValueInAsset(config) && {
                netValueInAsset: { formatted: "0", value: 0 },
              }),
            },
            strategyData: strategyData.data,
          },
          userStakes: null,
        }
      }

      // Calculate net value using LP token balance and token price
      const shares = lpTokenData.value
      const sharesFormatted = lpTokenData.formatted
      const tokenPrice = parseFloat(
        strategyData.data.tokenPrice || "0"
      )
      const baseAssetPriceValue = parseFloat(baseAssetPrice || "0")

      const netValue =
        Number(sharesFormatted) * tokenPrice * baseAssetPriceValue

      // Calculate net value in base asset for strategies that support it
      const netValueInAsset =
        showNetValueInAsset(config) && baseAssetPriceValue > 0
          ? netValue / baseAssetPriceValue
          : 0

      return {
        userStrategyData: {
          userData: {
            netValue: {
              formatted: formatUSD(netValue.toString(), 2),
              value: netValue,
            },
            shares: {
              formatted: sharesFormatted,
              value: shares,
            },
            stakedShares: {
              formatted: "0",
              value: 0n,
            },
            ...(showNetValueInAsset(config) && {
              netValueInAsset: {
                formatted: netValueInAsset.toFixed(5),
                value: netValueInAsset,
              },
            }),
          },
          strategyData: strategyData.data,
        },
        userStakes: null,
      }
    },
    enabled:
      !!userAddress &&
      !!sommPrice.data &&
      !!lpToken.data &&
      !!baseAssetPrice &&
      !!strategyData.data &&
      isNoDataSource === false,
  })
  return query
}
