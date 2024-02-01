import { useQuery } from "@tanstack/react-query"
import { getUserDataAllStrategies } from "data/actions/common/getUserDataAllStrategies"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useAllStrategiesData } from "./useAllStrategiesData"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import { chainConfig } from "data/chainConfig"
import { tokenConfig } from "data/tokenConfig"

export const useUserDataAllStrategies = () => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { data: allContracts } = useAllContracts()
  const strategies = useAllStrategiesData()
  const [error, setError] = useState(null)

  const { chain } = useNetwork()

  const sommToken = tokenConfig.find(
    (token) =>
      token.coinGeckoId === "sommelier" &&
      token.chain ===
        (chain?.name.toLowerCase().split(" ")[0] || "ethereum")
  )!
  const sommPrice = useCoinGeckoPrice(sommToken)


  const chainObj = chainConfig.find(
    (item) => item.wagmiId === chain?.id
  )!

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
        chain: chainObj.id,
      })
    },
    {
      enabled:
        !!allContracts &&
        !!signer?._isSigner &&
        !!strategies.data &&
        !!address &&
        !!sommPrice.data &&
        !!chainObj.id,
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
  }
}
