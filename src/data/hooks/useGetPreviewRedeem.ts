import { useQuery } from "@tanstack/react-query"
import { getPreviewRedeem } from "data/actions/common/getPreviewShare"
import { ConfigProps } from "data/types"
import { useAccount } from "wagmi"
import { useCreateContracts } from "./useCreateContracts"

export const useGetPreviewRedeem = ({
  cellarConfig,
  value,
}: {
  cellarConfig: ConfigProps
  value?: string
}) => {
  const { cellarContract } = useCreateContracts(cellarConfig)
  const signer01 = cellarContract

  const user = useAccount()
  return useQuery({
    queryKey: [
      "USE_GET_PREVIEW_SHARES",
      { config: cellarConfig.id, value, userAddress: user.address },
    ],
    queryFn: async () => {
      if (!cellarContract) throw new Error("Missing data")
      const data = await getPreviewRedeem({
        cellarContract: signer01,
        value,
      })
      if (!data)
        return {
          value: 0,
        }
      return data?.value
    },
    enabled: !!cellarContract && !!value,
}
  )
}
