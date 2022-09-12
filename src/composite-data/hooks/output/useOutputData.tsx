import { useGetCellarQuery } from "generated/subgraph"
import { useQuery } from "@tanstack/react-query"
import { useCellarData } from "../cellar/useCellarData"
import { useStakerData } from "../staker/useStakerData"
import { calculateData } from "src/composite-data/actions/calculate/cellarData"
import { cellarDataMap, ConfigProps } from "data/cellarDataMap"
import { useCreateContracts } from "./useCreateContracts"

export const useOutputData = (config: ConfigProps) => {
  const id = config.id.toLowerCase()

  const { stakerContract, cellarContract } =
    useCreateContracts(config)

  const stakerData = useStakerData({
    staker: {
      contract: stakerContract,
      key: config.staker.key,
    },
  })
  const cellarData = useCellarData({
    cellar: {
      contract: cellarContract,
      key: config.cellar.key,
    },
  })

  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: id,
      cellarString: id,
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const {
    tvlTotal,
    liquidityLimit,
    addedLiquidityAllTime,
    removedLiquidityAllTime,
    asset,
  } = cellar || {}

  const queryCalculateKey = [
    "CALCULATE_DATA",
    {
      activeAsset: cellarData.data?.activeAsset,
      addedLiquidityAllTime,
      apy: cellarData.data?.apy,
      assetDecimals: asset?.decimals,
      liquidityLimit,
      potentialStakingApy: stakerData.data?.potentialStakingApy,
      removedLiquidityAllTime,
      tvlTotal,
    },
  ] as const

  const queryCalculate = useQuery(
    queryCalculateKey,
    ({
      queryKey: [
        ,
        {
          activeAsset,
          addedLiquidityAllTime,
          apy,
          assetDecimals,
          liquidityLimit,
          potentialStakingApy,
          removedLiquidityAllTime,
          tvlTotal,
        },
      ],
    }) =>
      calculateData({
        activeAsset,
        addedLiquidityAllTime,
        apy,
        assetDecimals,
        liquidityLimit,
        potentialStakingApy,
        removedLiquidityAllTime,
        tvlTotal,
      }),
    {
      enabled: Boolean(
        cellarData.data?.activeAsset &&
          addedLiquidityAllTime &&
          cellarData.data?.apy &&
          asset?.decimals &&
          liquidityLimit &&
          stakerData.data?.potentialStakingApy &&
          removedLiquidityAllTime &&
          tvlTotal &&
          id
      ),
    }
  )

  const staticCellarData = cellarDataMap[id]

  const refetchAll = () => {
    void cellarData.refetch()
    void stakerData.refetch()
  }

  const result = {
    staticCellarData,
    ...queryCalculate.data,
  }

  return {
    data: result,
    error:
      queryCalculate.error || cellarData.error || stakerData.error,
    isFetching:
      queryCalculate.isFetching ||
      cellarData.isFetching ||
      stakerData.isFetching,
    isLoading:
      queryCalculate.isLoading ||
      cellarData.isLoading ||
      stakerData.isLoading,
    isRefetching:
      queryCalculate.isRefetching ||
      cellarData.isRefetching ||
      stakerData.isRefetching,
    refetch: refetchAll,
  }
}
