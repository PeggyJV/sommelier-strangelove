import { ConfigProps } from "data/types"
import { useAccount, useBalance } from "wagmi"
import { getAddress } from "viem"

export const useUserBalance = (
  config: ConfigProps,
  enabled: boolean = true
) => {
  const { address } = useAccount()

  const lpToken = useBalance({
    address: address,
    token: getAddress(config.lpToken.address),
    chainId: config.chain.wagmiId,
    unit: "wei",
    // Gate network request to run only when explicitly enabled
    query: { enabled }
  })
  return {
    lpToken
  }
}
