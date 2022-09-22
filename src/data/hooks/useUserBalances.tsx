import { ConfigProps } from "data/cellarDataMap"
import { useAccount, useBalance } from "wagmi"

export const useUserBalances = (config: ConfigProps) => {
  const { address } = useAccount()

  const lpToken = useBalance({
    addressOrName: address,
    token: config.lpToken.address,
    formatUnits: "wei",
    watch: true,
  })

  return {
    lpToken,
  }
}
