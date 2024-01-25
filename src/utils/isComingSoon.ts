import { isPast } from "date-fns"

export const isComingSoon = (launchDate?: Date) => {
  if (!launchDate) return false

  return !isPast(launchDate)
}
