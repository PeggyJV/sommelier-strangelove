import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"
import { COUNT_DOWN_TIMEZONE } from "utils/config"

interface useCountdownProps {
  launchDate: string | null
}
export const useCountdown = ({ launchDate }: useCountdownProps) => {
  const dateTz = zonedTimeToUtc(new Date(String(launchDate)), "EST")
  const formatedLaunchDate = utcToZonedTime(
    dateTz,
    COUNT_DOWN_TIMEZONE
  )

  const formatedDateNow = new Date()

  const isCountdown =
    formatedLaunchDate !== null
      ? formatedLaunchDate > formatedDateNow
      : false

  return isCountdown
}
