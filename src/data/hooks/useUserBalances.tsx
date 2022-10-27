import { ConfigProps } from "data/types"
import { useAccount, useBalance, useToken } from "wagmi"

export const useUserBalances = (config: ConfigProps) => {
  const { address } = useAccount()

  const lpToken = useBalance({
    addressOrName: address,
    token: config.lpToken.address,
    chainId: 1,
    formatUnits: "wei",
    watch: true,
  })

  const lpTokenInfo = useToken({
    address: config.lpToken.address,
    chainId: 1,
  })

  return {
    lpToken,
    lpTokenInfo,
  }
}
