import { zonedTimeToUtc } from "date-fns-tz"

export const getStakingEnd = async (
  stakerContract: unknown
) => {
  try {
    const contract = stakerContract as {
      read: {
        ended: () => Promise<boolean>
        endTimestamp: () => Promise<bigint>
      }
    }
    const ended = await contract.read.ended()
    const endTimestamp = await contract.read.endTimestamp()
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
