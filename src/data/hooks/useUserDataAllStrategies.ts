import { useQuery } from "@tanstack/react-query"
import { getUserDataAllStrategies } from "data/actions/common/getUserDataAllStrategies"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useAllStrategiesData } from "./useAllStrategiesData"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { useState, useEffect } from "react"

export const useUserDataAllStrategies = () => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { data: allContracts } = useAllContracts()
  const strategies = useAllStrategiesData()
  const sommPrice = useCoinGeckoPrice("sommelier")
  const [error, setError] = useState(null)

  const query = useQuery(
    [
      "USE_USER_DATA_ALL_STRATEGIES",
      {
        allContracts: !!allContracts,
        signer: signer?._isSigner,
        userAddress: address,
      },
    ],
    async () => {
      return await getUserDataAllStrategies({
        allContracts: allContracts!,
        strategiesData: strategies.data!,
        userAddress: address!,
        sommPrice: sommPrice.data!,
      })
    },
    {
      enabled:
        !!allContracts &&
        !!signer?._isSigner &&
        !!strategies.data &&
        !!address &&
        !!sommPrice.data,
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
  }
}
