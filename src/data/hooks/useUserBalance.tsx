import { ConfigProps } from "data/types"
import { useAccount, useBalance } from "wagmi"
import { getAddress } from "viem"

export const useUserBalance = (config: ConfigProps) => {
  const { address } = useAccount()

  const lpToken = useBalance({
    address: address,
    token: getAddress(config.lpToken.address),
    chainId: config.chain.wagmiId,
    unit: "wei",
    watch: false,
  })
  return {
    lpToken
  }
}
