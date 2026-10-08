import { usePublicClient } from "wagmi"
import { useQuery } from "@tanstack/react-query"
import { StrategyData } from "data/actions/types"
import { cellarDataMap } from "data/cellarDataMap"
import { formatUSD } from "utils/formatCurrency"
import { formatUnits } from "viem"

type LegacyUserDataFallback = {
  shares: bigint
  stakedShares: bigint
  strategyData: null
  allStrategiesData: null
  netValue: number
}

type UserDataWithContractsFallback = {
  userStrategyData: {
    userData: {
      netValue: { formatted: string; value: number }
      shares: { formatted: string; value: bigint }
      stakedShares: { formatted: string; value: bigint }
    }
    strategyData:
      | (StrategyData & {
          symbol?: string
          token?: { value?: string | number; formatted?: string }
          description?: string
          logo?: string
          slug?: string
          name?: string
        })
      | null
      | undefined
  }
  userStakes: null
}

export const getUserData = async (
  _address: string,
  _publicClient: unknown,
  _chainId: number
): Promise<LegacyUserDataFallback> => {
  try {
    // This legacy function isn't used for critical paths anymore.
    // Return a safe minimal object to prevent runtime errors.
    return {
      shares: 0n,
      stakedShares: 0n,
      strategyData: null,
      allStrategiesData: null,
      netValue: 0,
    }
  } catch {
    return {
      shares: 0n,
      stakedShares: 0n,
      strategyData: null,
      allStrategiesData: null,
      netValue: 0,
    }
  }
}

export const getUserDataWithContracts = async ({
  contracts,
  address,
  strategyData,
  userAddress,
  sommPrice: _sommPrice,
  baseAssetPrice: _baseAssetPrice,
  chain,
}: {
  contracts: unknown
  address: string
  strategyData:
    | (StrategyData & {
        symbol?: string
        token?: { value?: string | number; formatted?: string }
        description?: string
        logo?: string
        slug?: string
        name?: string
      })
    | null
    | undefined
  userAddress: string
  sommPrice: string
  baseAssetPrice: string
  chain: string
}): Promise<UserDataWithContractsFallback> => {
  const fallback = (): UserDataWithContractsFallback => ({
    userStrategyData: {
      userData: {
        netValue: { formatted: "0", value: 0 },
        shares: { formatted: "0", value: 0n },
        stakedShares: { formatted: "0", value: 0n },
      },
      strategyData,
    },
    userStakes: null,
  })

  try {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) =>
        config.cellar.address.toLowerCase() === address.toLowerCase() &&
        config.chain.id === chain
    )
    const balanceContracts = contracts as {
      cellarContract?: {
        read?: {
          balanceOf?: (args: [`0x${string}`]) => Promise<bigint>
        }
      }
      stakerContract?: {
        read?: {
          balanceOf?: (args: [`0x${string}`]) => Promise<bigint>
        }
      }
    }
    const cellarBalanceOf =
      balanceContracts.cellarContract?.read?.balanceOf

    if (!strategy || !cellarBalanceOf) return fallback()

    const shares = await cellarBalanceOf([
      userAddress as `0x${string}`,
    ])
    const stakedShares = balanceContracts.stakerContract?.read
      ?.balanceOf
      ? await balanceContracts.stakerContract.read.balanceOf([
          userAddress as `0x${string}`,
        ])
      : 0n
    const decimals = strategy.config.cellar.decimals
    const sharesFormatted = formatUnits(shares, decimals)
    const stakedSharesFormatted = formatUnits(
      stakedShares,
      decimals
    )
    const totalShares = Number(
      formatUnits(shares + stakedShares, decimals)
    )
    const tokenPrice =
      parseFloat(
        String(strategyData?.tokenPrice ?? "0").replace(/[$,]/g, "")
      ) || 0
    const netValue = totalShares * tokenPrice

    return {
      userStrategyData: {
        userData: {
          netValue: {
            formatted: formatUSD(netValue.toString(), 2) ?? "$0.00",
            value: netValue,
          },
          shares: { formatted: sharesFormatted, value: shares },
          stakedShares: {
            formatted: stakedSharesFormatted,
            value: stakedShares,
          },
        },
        strategyData,
      },
      userStakes: null,
    }
  } catch (error) {
    console.error("Error in getUserData:", error)
    return fallback()
  }
}

export const useUserData = (address: string, chainId: number) => {
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ["USE_USER_DATA", address, chainId],
    queryFn: async () => {
      return await getUserData(address, publicClient, chainId)
    },
    enabled: Boolean(address && chainId && publicClient),
  })
}
