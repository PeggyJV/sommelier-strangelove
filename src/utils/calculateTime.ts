export const getToday = () => {
  const dayInMs = 24 * 60 * 60 * 1000
  const now = new Date()
  const today = (Math.floor(now.getTime() / dayInMs) * dayInMs) / 1000

  return today
}

export const getPrevious24Hours = () => {
  const now = new Date()
  const last24HoursInSeconds = 24 * 60 * 60
  now.setSeconds(now.getSeconds() - last24HoursInSeconds)
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)

  return secondsSinceEpoch
}

export const getPreviousWeek = (): number => {
  const now = new Date()
  const lastWeekInSeconds = 24 * 60 * 60 * 7
  now.setSeconds(now.getSeconds() - lastWeekInSeconds)
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)

  return secondsSinceEpoch
}

export const getPreviousDay = (): number => {
  const now = new Date()
  const lastWeekInSeconds = 24 * 60 * 60 * 2
  now.setSeconds(now.getSeconds() - lastWeekInSeconds)
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)

  return secondsSinceEpoch
}

export const getPreviousMonth = (): number => {
  const dayInMs = 24 * 60 * 60 * 1000
  const now = new Date()
  const previousMonth =
    (Math.floor((now.getTime() - dayInMs * 30) / dayInMs) * dayInMs) /
    1000

  return previousMonth
}
