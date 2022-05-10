export const getPrevious24Hours = () => {
  const now = new Date()
  const last24HoursInSeconds = 24 * 60 * 60
  now.setSeconds(now.getSeconds() - last24HoursInSeconds)
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)

  return secondsSinceEpoch
}
