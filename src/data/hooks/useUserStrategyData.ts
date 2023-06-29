import { useQuery } from "@tanstack/react-query"
import { getUserData } from "data/actions/common/getUserData"
import { cellarDataMap } from "data/cellarDataMap"
import { tokenConfig } from "data/tokenConfig"
import { useGetStrategyDataQuery } from "generated/subgraph"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { useStrategyData } from "./useStrategyData"
import { useUserBalances } from "./useUserBalances"

export const useUserStrategyData = (strategyAddress: string) => {
  const { data: signer } = useSigner()
  const { address: userAddress } = useAccount()

  const { data: allContracts } = useAllContracts()
  const strategyData = useStrategyData(strategyAddress)
  const sommPrice = useCoinGeckoPrice("sommelier")

  const [{ data: sgData, error }, reFetch] = useGetStrategyDataQuery({
    variables: { cellarAddress: strategyAddress },
  })
  const config = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
      strategyAddress.toLowerCase()
  )!.config

  const isNoSubgraph = Boolean(
    Object.values(cellarDataMap).find(
      (item) => item.config.cellar.address === strategyAddress
    )?.config.noSubgraph
  )
  const { lpToken } = useUserBalances(config)
  const baseAsset = tokenConfig.find(
    (token) => token.symbol === sgData?.cellar?.asset.symbol
  )?.coinGeckoId
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
        sgData: sgData?.cellar,
      },
    ],
    async () => {
      return await getUserData({
        contracts: allContracts![strategyAddress],
        address: strategyAddress,
        strategyData: strategyData.data!,
        userAddress: userAddress!,
        sommPrice: sommPrice.data ?? "0",
        sgData: sgData?.cellar,
        decimals: sgData?.cellar?.asset.decimals ?? 6,
        baseAssetPrice: baseAssetPrice ?? "0",
        symbol: sgData?.cellar?.asset.symbol ?? "USDC",
      })
    },
    {
      enabled:
        !!allContracts &&
        !!signer?._isSigner &&
        !!sommPrice.data &&
        !!lpToken &&
        !!baseAssetPrice &&
        (isNoSubgraph || !!sgData),
    }
  )
  return query
}
