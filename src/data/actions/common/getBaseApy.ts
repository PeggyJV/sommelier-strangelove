export const getBaseApy = async ({
  baseApy,
  dayDatas,
  hardcodedApy,
}: {
  baseApy?: number
  dayDatas?: { date: number; shareValue: string }[]
  hardcodedApy?: boolean
}) => {
  try {
    const isUsingHardcodedApy =
      !dayDatas || (dayDatas?.length === 1 && hardcodedApy)

    const cellarApy = (() => {
      if (isUsingHardcodedApy) {
        return baseApy || 0
      }
      const indexThatHaveChanges = dayDatas.findIndex(
        (data, idx, arr) => {
          if (idx === 0) return false // return false because first data doesn't have comparison

          const prev = arr[idx - 1].shareValue
          return prev !== data.shareValue
        }
      )
      if (indexThatHaveChanges === -1) return 0

      // dayDatas is in desc order
      const latestDataChanged =
        dayDatas[indexThatHaveChanges - 1].shareValue
      const prevDayLatestData =
        dayDatas[indexThatHaveChanges].shareValue

      const yieldGain =
        (Number(latestDataChanged) - Number(prevDayLatestData)) /
        Number(prevDayLatestData)

      return yieldGain * 52 * 100
    })()

    return {
      formatted: cellarApy.toFixed(1) + "%",
      value: Number(cellarApy.toFixed(1)),
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    return
  }
}
