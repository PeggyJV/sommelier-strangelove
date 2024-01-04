import { ConfigProps } from "data/types"
import { useAccount, useBalance, useToken } from "wagmi"
import { getAddress } from "ethers/lib/utils.js"

export const useUserBalances = (config: ConfigProps) => {
  const { address } = useAccount()

  const lpToken = useBalance({
    address: address,
    token: getAddress(config.lpToken.address),
    chainId: config.chain.wagmiId,
    formatUnits: "wei",
    watch: true,
  })

  const lpTokenInfo = useToken({
    address: getAddress(config.lpToken.address),
    chainId: config.chain.wagmiId,
  })

  return {
    lpToken,
    lpTokenInfo,
  }
}
