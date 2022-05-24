export const getPrevious24Hours = () => {
  const now = new Date()
  const last24HoursInSeconds = 24 * 60 * 60
  now.setSeconds(now.getSeconds() - last24HoursInSeconds)
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)

  return secondsSinceEpoch
}

export const getPreviousWeek = () => {
  const now = new Date()
  const lastWeekInSeconds = 24 * 60 * 60 * 7
  now.setSeconds(now.getSeconds() - lastWeekInSeconds)
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)

  return secondsSinceEpoch
}
