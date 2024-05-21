import { useQuery } from "@tanstack/react-query"
import { getUserDataAllStrategies } from "data/actions/common/getUserDataAllStrategies"
import { useAccount, useWalletClient } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useAllStrategiesData } from "./useAllStrategiesData"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { chainConfig } from "data/chainConfig"
import { tokenConfig } from "data/tokenConfig"

export const useUserDataAllStrategies = () => {
  const { data: walletClient } = useWalletClient()
  const { address, chain } = useAccount()
  const { data: allContracts } = useAllContracts()
  const strategies = useAllStrategiesData()

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

  const query = useQuery({
    queryKey: [
      "USE_USER_DATA_ALL_STRATEGIES",
      {
        allContracts: !!allContracts,
        signer: walletClient,
        userAddress: address,
      },
    ],
    queryFn: async () => {
      return await getUserDataAllStrategies({
        allContracts: allContracts!,
        strategiesData: strategies.data!,
        userAddress: address!,
        sommPrice: sommPrice.data!,
        chain: chainObj.id,
      })
    },
    enabled:
      !!allContracts &&
      !!walletClient &&
      !!strategies.data &&
      !!address &&
      !!sommPrice.data &&
      !!chainObj.id,
    }
  )

  return {
    ...query,
    isError: query.isError,
  }
}
