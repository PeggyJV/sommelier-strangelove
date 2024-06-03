import { zonedTimeToUtc } from "date-fns-tz"
import { CellarStakingV0815 } from "src/abi/types"

export const getStakingEnd = async (
  stakerContract: CellarStakingV0815
) => {
  try {
    const ended = await stakerContract.read.ended()
    const endTimestamp = await stakerContract.read.endTimestamp()
    const endDate =
      Number(endTimestamp) === 0
        ? undefined
        : zonedTimeToUtc(
            new Date(Number(endTimestamp) * 1000),
            "UTC"
          )
    return {
      ended,
      endDate,
    }
  } catch (error) {
    return undefined
  }
}
