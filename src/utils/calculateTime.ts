const SECONDS_PER_DAY = 24 * 60 * 60

const getPreviousTime = (days: number): number => {
  const now = new Date()
  now.setSeconds(now.getSeconds() - days * SECONDS_PER_DAY)
  return Math.round(now.getTime() / 1000)
}

export const getToday = (): number => {
  const dayInMs = SECONDS_PER_DAY * 1000
  const now = new Date()
  return (Math.floor(now.getTime() / dayInMs) * dayInMs) / 1000
}

export const getPrevious24Hours = (): number => getPreviousTime(1)

export const getPreviousWeek = (): number => getPreviousTime(8)

export const getPreviousDay = (): number => getPreviousTime(2)

export const getPreviousMonth = (): number => getPreviousTime(31)

export const getPrevious10Days = (): number => getPreviousTime(10)
