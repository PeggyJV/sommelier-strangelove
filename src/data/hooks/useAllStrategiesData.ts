import { useQuery } from "@tanstack/react-query"
import { getAllStrategiesData } from "data/actions/common/getAllStrategiesData"
import { useAccount, usePublicClient } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { fetchCellarStrategyData } from "queries/get-all-strategies-data"
import { useState, useEffect } from "react"
import { GetAllStrategiesDataQuery } from "data/actions/types"
import { tokenConfig } from "data/tokenConfig"
import { getChainByViemId, supportedChains } from "src/data/chainConfig"

export const useAllStrategiesData = () => {
  const client = usePublicClient()
  const { chain: viemChain } = useAccount()
  const { data: allContracts } = useAllContracts()

  const chain = getChainByViemId(viemChain?.name)

  const sommToken = tokenConfig.find((token) => {
    const compareChain = supportedChains.includes(chain ? chain.id : "")
      ? "ethereum"
      : chain?.id
    return (
      token.coinGeckoId === "sommelier" &&
      token.chain === (compareChain || "ethereum")
    )
  })!

  const { data: sommPrice } = useCoinGeckoPrice(sommToken)

  const [cellarData, setcellarData] = useState<
    GetAllStrategiesDataQuery | undefined
  >(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCellarStrategyData()
      .then(({ data, error }) => {
        if (error) {
          setError(error)
        } else {
          setcellarData(data)
        }
      })
      .catch((error) => setError(error))
    return () => {
      setError(null);
      setcellarData(undefined);
    };
  }, [])

  const query = useQuery({
    queryKey: ["USE_ALL_STRATEGIES_DATA", client?.uid ],
    queryFn: async () => {
      return await getAllStrategiesData({
        allContracts: allContracts!,
        sommPrice: sommPrice!,
        cellarData: cellarData,
      })
    },
    enabled: !!allContracts && !!sommPrice && !!cellarData,
  }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
  }
}
