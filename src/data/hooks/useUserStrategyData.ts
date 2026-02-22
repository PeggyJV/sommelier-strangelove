import { useQuery } from "@tanstack/react-query"
import { cellarDataMap } from "data/cellarDataMap"
import { useAccount } from "wagmi"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { useStrategyData } from "./useStrategyData"
import { useUserBalance } from "./useUserBalance"
import { tokenConfig } from "data/tokenConfig"
import { formatUSD } from "utils/formatCurrency"
import { showNetValueInAsset } from "data/uiConfig"
import { useCreateContracts } from "./useCreateContracts"
import { getUserStakes as fetchUserStakes } from "data/actions/CELLAR_STAKING_V0815/getUserStakes"

export const useUserStrategyData = (
  strategyAddress: string,
  chain: string,
  enabled: boolean = true
) => {
  type UserStakesResult = {
    userStakes?: Array<{
      amount: string | number
      lock: number
      unbondTimestamp: number
    }>
    claimAllRewards?: unknown[]
  }
  const fallbackConfig = Object.values(cellarDataMap)[0]?.config
  if (!fallbackConfig) {
    throw new Error("cellarDataMap is empty")
  }

  const matchedCellar = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
        strategyAddress.toLowerCase() &&
      item.config.chain.id === chain
  )

  const config = matchedCellar?.config ?? fallbackConfig
  const isValidStrategyConfig = Boolean(matchedCellar?.config)

  const { address: userAddress } = useAccount()
  const strategyData = useStrategyData(strategyAddress, chain)
  const chainSommToken = tokenConfig.find(
    (token) =>
      token.coinGeckoId === "sommelier" && token.chain === chain
  )
  const sommTokenFallback =
    tokenConfig.find((token) => token.coinGeckoId === "sommelier") ??
    tokenConfig[0]
  const sommToken = chainSommToken ?? sommTokenFallback
  const hasSommToken = Boolean(chainSommToken || sommTokenFallback)

  const sommPrice = useCoinGeckoPrice(sommToken)

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

  // Contracts for optional legacy staking reads
  const { stakerContract } = useCreateContracts(config)

  const query = useQuery({
    queryKey: [
      "USE_USER_DATA",
      strategyAddress,
      chain,
      userAddress,
      // Recompute when LP balance, token price or base-asset price change
      String(lpToken.data?.formatted ?? ""),
      String(strategyData.data?.tokenPrice ?? ""),
      String(baseAssetPrice ?? ""),
    ],
    queryFn: async () => {
      // Attempt to read legacy staking positions regardless of LP token availability
      let userStakesResult: UserStakesResult | null = null
      try {
        if (config.staker && stakerContract && userAddress) {
          const stakingData = (await fetchUserStakes(
            userAddress,
            stakerContract,
            (sommPrice.data as string) || "0",
            config
          )) as unknown as {
            userStakes?: Array<{
              amount: bigint | string | number
              lock: number
              unbondTimestamp: number
            }>
            claimAllRewards?: unknown[]
          }
          userStakesResult = {
            claimAllRewards: stakingData.claimAllRewards ?? [],
            userStakes: stakingData.userStakes?.map((stake) => ({
              amount:
                typeof stake.amount === "bigint"
                  ? stake.amount.toString()
                  : stake.amount,
              lock: stake.lock,
              unbondTimestamp: stake.unbondTimestamp,
            })),
          }
        }
      } catch (e) {
        // Non-fatal; keep staking data null on failure
        userStakesResult = null
      }

      // Use the LP token data from useUserBalance
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
          userStakes: userStakesResult,
        }
      }

      // Calculate net value using LP token balance and token price
      const shares = lpTokenData.value
      const sharesFormatted = lpTokenData.formatted
      const tokenPrice =
        parseFloat(
          String(strategyData.data.tokenPrice || "0").replace(/[$,]/g, "")
        ) || 0
      const baseAssetPriceValue =
        parseFloat(String(baseAssetPrice || "0").replace(/,/g, "")) || 0

      const sharesNumber = (() => {
        const n = parseFloat(String(sharesFormatted).replace(/,/g, ""))
        return Number.isFinite(n) ? n : 0
      })()

      const netValue = sharesNumber * tokenPrice

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
        userStakes: userStakesResult,
      }
    },
    enabled:
      enabled &&
      !!userAddress &&
      isValidStrategyConfig &&
      hasSommToken &&
      !!strategyData.data &&
      isNoDataSource === false,
    staleTime: 120_000,
  })
  return query
}
