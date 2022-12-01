import { zonedTimeToUtc } from "date-fns-tz"
import { CellarStakingV0815 } from "src/abi/types"

export const getStakingEnd = async (
  stakerContract: CellarStakingV0815
) => {
  const ended = await stakerContract.ended()
  const endTimestamp = await stakerContract.endTimestamp()
  const endDate = zonedTimeToUtc(
    new Date(endTimestamp.toNumber() * 1000),
    "UTC"
  )
  return {
    ended,
    endDate,
  }
}
