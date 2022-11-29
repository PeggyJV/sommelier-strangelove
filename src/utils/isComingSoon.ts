import { isPast } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"

export const isComingSoon = (launchDate?: Date) => {
  if (!launchDate) return false
  const dateTz = zonedTimeToUtc(launchDate, "EST")

  return !isPast(dateTz)
}
