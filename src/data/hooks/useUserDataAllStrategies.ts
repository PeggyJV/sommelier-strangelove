import { useQuery } from "@tanstack/react-query"
import { getUserDataAllStrategies } from "data/actions/common/getUserDataAllStrategies"
import { useAccount, useWalletClient } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useAllStrategiesData } from "./useAllStrategiesData"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { getChainByViemId } from "data/chainConfig"
import { tokenConfig } from "data/tokenConfig"

export const useUserDataAllStrategies = () => {
  const { data: walletClient } = useWalletClient()
  const { address, chain: viemChain } = useAccount()
  const { data: allContracts } = useAllContracts()
  const strategies = useAllStrategiesData()
  const chain = getChainByViemId(viemChain?.name)
  const sommToken = tokenConfig.find(
    (token) =>
      token.coinGeckoId === "sommelier" &&
      token.chain ===
        (chain.id || "ethereum")
  )!
  const sommPrice = useCoinGeckoPrice(sommToken)

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
        chain: chain.id,
      })
    },
    enabled:
      !!allContracts &&
      !!walletClient &&
      !!strategies.data &&
      !!address &&
      !!sommPrice.data &&
      !!chain.id,
    }
  )

  return {
    ...query,
    isError: query.isError,
  }
}
