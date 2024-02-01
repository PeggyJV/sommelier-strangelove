import { useQuery } from "@tanstack/react-query"
import { getUserData } from "data/actions/common/getUserData"
import { cellarDataMap } from "data/cellarDataMap"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { useStrategyData } from "./useStrategyData"
import { useUserBalances } from "./useUserBalances"
import { useNetwork } from "wagmi"
import { tokenConfig } from "data/tokenConfig"

export const useUserStrategyData = (strategyAddress: string, chain: string) => {
  const { data: signer } = useSigner()
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
      strategyAddress.toLowerCase() && item.config.chain.id === chain
  )!.config

  const isNoDataSource = Boolean(
    Object.values(cellarDataMap).find(
      (item) => item.config.cellar.address === strategyAddress && item.config.chain.id === chain
    )?.config.isNoDataSource
  )
  const { lpToken } = useUserBalances(config)
  const baseAsset = config.baseAsset
  const { data: baseAssetPrice } = useCoinGeckoPrice(
    baseAsset
  )

  // if chain is not ethereum, key format is '{address}-{chain}', otherwise it is '{address}'
  const key =
    strategyAddress +
    (config.chain.id !== "ethereum" ? "-" + chain : "")
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
        contracts: allContracts![key],
        address: strategyAddress,
        strategyData: strategyData.data!,
        userAddress: userAddress!,
        sommPrice: sommPrice.data ?? "0",
        baseAssetPrice: baseAssetPrice ?? "0",
        chain: chain,
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
