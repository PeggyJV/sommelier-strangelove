import { useQuery } from "@tanstack/react-query"
import { getActiveAsset } from "data/actions/common/getActiveAsset"
import { ConfigProps } from "data/types"
import { useCreateContracts } from "./useCreateContracts"

export const useActiveAsset = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const queryEnabled = Boolean(cellarContract.provider)

  const query = useQuery(
    ["USE_ACTIVE_ASSET", config.cellar.address],
    async () => {
      return await getActiveAsset(cellarContract)
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}
