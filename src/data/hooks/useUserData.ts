import { useQuery } from "@tanstack/react-query"
import { getUserData } from "data/actions/common/getUserData"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useAllStrategiesData } from "./useAllStrategiesData"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"

export const useUserData = () => {
  const { data: signer } = useSigner()
  const { address } = useAccount()

  const { data: allContracts } = useAllContracts()
  const strategies = useAllStrategiesData()
  const sommPrice = useCoinGeckoPrice("sommelier")

  const query = useQuery(
    [
      "USE_USER_DATA",
      !!allContracts,
      address,
      { signer: signer?._isSigner },
    ],
    async () => {
      return await getUserData({
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
  return query
}
