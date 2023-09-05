import { useQuery } from "@tanstack/react-query"
import { getUserData } from "data/actions/common/getUserData"
import { cellarDataMap } from "data/cellarDataMap"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { useStrategyData } from "./useStrategyData"
import { useUserBalances } from "./useUserBalances"
import { useState } from "react"

export const useUserStrategyData = (strategyAddress: string) => {
  const { data: signer } = useSigner()
  const { address: userAddress } = useAccount()
  const { data: allContracts } = useAllContracts()
  const strategyData = useStrategyData(strategyAddress)
  const sommPrice = useCoinGeckoPrice("sommelier")

  const config = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
      strategyAddress.toLowerCase()
  )!.config

  const isNoDataSource = Boolean(
    Object.values(cellarDataMap).find(
      (item) => item.config.cellar.address === strategyAddress
    )?.config.isNoDataSource
  )
  const { lpToken } = useUserBalances(config)
  const baseAsset = config.baseAsset.coinGeckoId
  const { data: baseAssetPrice } = useCoinGeckoPrice(
    baseAsset ?? "usd-coin"
  )
  const query = useQuery(
    [
      "USE_USER_DATA",
      {
        signer: true,
        contractAddress: strategyAddress,
        userAddress,
      },
    ],
    async () => {
      return await getUserData({
        contracts: allContracts![strategyAddress],
        address: strategyAddress,
        strategyData: strategyData.data!,
        userAddress: userAddress!,
        sommPrice: sommPrice.data ?? "0",
        baseAssetPrice: baseAssetPrice ?? "0",
      })
    },
    {
      enabled:
        !!allContracts &&
        !!signer?._isSigner &&
        !!sommPrice.data &&
        !!lpToken &&
        !!baseAssetPrice &&
        !!strategyData.data &&
        isNoDataSource === false,
    }
  )
  return query
}
