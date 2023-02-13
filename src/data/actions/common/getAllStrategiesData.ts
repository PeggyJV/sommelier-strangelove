import { cellarDataMap } from "data/cellarDataMap"
import {
  CellarStakingV0815,
  CellarV0815,
  CellarV0816,
} from "src/abi/types"
import { AllContracts } from "../types"
import { getActiveAsset } from "./getActiveAsset"
import { getTotalAssets } from "./getTotalAssets"

import { createClient } from "urql"
import { isAssetDistributionEnabled } from "data/uiConfig"
import { getTokenByAddress, getTokenBySymbol } from "./getToken"
import { add, isBefore, subDays } from "date-fns"
import { getStakingEnd } from "../CELLAR_STAKING_V0815/getStakingEnd"
import { getRewardsApy } from "./getRewardsApy"
import { CellarKey, ConfigProps } from "data/types"
import {
  GetAllTimeShareValueDocument,
  GetAllTimeShareValueQuery,
} from "generated/subgraph"
import { getBaseApy as getV2BaseApy } from "../CELLAR_V2/getBaseApy"
import { getBaseApy } from "./getBaseApy"
import { getChanges } from "./getChanges"

export const getAllStrategiesData = async ({
  allContracts,
  sommPrice,
}: {
  allContracts: AllContracts
  sommPrice: string
}) => {
  const url = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT!
  const client = createClient({ url })

  const data = Promise.all(
    Object.entries(allContracts)?.map(
      async ([address, contracts]) => {
        const strategyData = Object.values(cellarDataMap).find(
          ({ config }) => config.cellar.address === address
        )!
        const config: ConfigProps = strategyData.config!

        const { cellarContract, stakerContract } = contracts

        const resDayDatas = await client
          .query<GetAllTimeShareValueQuery>(
            GetAllTimeShareValueDocument,
            {
              cellarAddress: address,
            }
          )
          .toPromise()
        const dayDatas = resDayDatas.data?.cellar?.dayDatas

        const name = strategyData.name
        const protocols = strategyData.protocols
        const type = strategyData.cellarType
        const provider = strategyData.strategyProvider
        const launchDate = strategyData.launchDate
        const isNew =
          !!launchDate &&
          isBefore(launchDate, add(new Date(), { weeks: 2 }))

        const activeAsset = await getActiveAsset(
          cellarContract as CellarV0815 | CellarV0816
        )
        const tvm = await getTotalAssets(
          cellarContract as CellarV0815 | CellarV0816,
          activeAsset
        )

        const tradedAssets = await (async () => {
          if (!isAssetDistributionEnabled(config)) {
            const assets = strategyData.tradedAssets
            if (!assets) return
            const tokens = await Promise.all(
              assets.map(async (v) => {
                const token = await getTokenBySymbol(v)
                return token
              })
            )
            return tokens
          }

          const positions = await (
            cellarContract as CellarV0816
          ).getPositions()
          const tokens = await Promise.all(
            positions.map(async (v) => {
              const token = await getTokenByAddress(v)
              return token
            })
          )
          return tokens
        })()

        const stakingEnd = await getStakingEnd(
          stakerContract as CellarStakingV0815
        )

        const rewardsApy = await getRewardsApy({
          sommPrice,
          stakerContract: stakerContract as CellarStakingV0815,
        })

        const baseApy = await (async () => {
          const datas = resDayDatas.data?.cellar?.dayDatas.slice(
            0,
            10
          )

          if (config.cellar.key === CellarKey.CELLAR_V2) {
            const launchDay = launchDate ?? subDays(new Date(), 8)
            const launchEpoch = Math.floor(launchDay.getTime() / 1000)
            return await getV2BaseApy({
              launchEpoch: launchEpoch,
              baseApy: config.baseApy,
              dayDatas: datas,
            })
          }

          return await getBaseApy({
            baseApy: config.baseApy,
            dayDatas,
          })
        })()

        const changes = getChanges(dayDatas)

        return {
          name,
          type,
          provider,
          activeAsset,
          tvm,
          tradedAssets,
          protocols,
          launchDate,
          isNew,
          stakingEnd,
          rewardsApy,
          baseApy,
          changes,
        }
      }
    )
  )
  return data
}
