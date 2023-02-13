export const getBaseApy = async ({
  baseApy,
  dayDatas,
  hardcodedApy,
  launchEpoch,
}: {
  baseApy?: number
  dayDatas?: { date: number; shareValue: string }[]
  hardcodedApy?: boolean
  launchEpoch: number
}) => {
  try {
    const isUsingHardcodedApy =
      !dayDatas || (dayDatas?.length === 1 && hardcodedApy)

    // cellar apy
    const cellarApy = (() => {
      if (isUsingHardcodedApy) {
        return baseApy || 0
      }

      // dayDatas is ordered by date desc
      const seventhDayIdx = 6 // Index of 7 days before today
      const today = dayDatas[0]

      // Try to find the index of the day before the launch
      // then subtract 1 to get the index of the day of the launch
      const launchIdx =
        dayDatas.findIndex((day) => day.date < launchEpoch) - 1

      let numDays = 7
      let prevIdx = seventhDayIdx
      if (launchIdx >= 0 && launchIdx < seventhDayIdx) {
        // It has been less than a week since launch
        numDays = launchIdx + 1
        prevIdx = launchIdx
      }

      const todayValue = today.shareValue
      const previousValue = dayDatas[prevIdx].shareValue
      const yieldGain =
        (Number(todayValue) - Number(previousValue)) /
        Number(previousValue)

      return yieldGain * (365 / numDays) * 100
    })()

    return cellarApy.toFixed(1) + "%"
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    return
  }
}
