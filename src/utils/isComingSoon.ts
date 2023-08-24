import { isPast } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"

export const isComingSoon = (launchDate?: Date) => {
  if (!launchDate) return false

  return !isPast(launchDate)
}
