import { Box, Text } from "@chakra-ui/react"
import { intervalToDuration } from "date-fns"
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz"
import { COUNT_DOWN_TIMEZONE } from "utils/config"

type StrategyDateProps = {
  date?: string
}
export const StrategyDate = (props: StrategyDateProps) => {
  // After launch until 1 month = new
  // before launch = launch date - date now
  // after launch more than 1 month = none
  const { date } = props
  const dateTz = zonedTimeToUtc(date!, "EST")
  const et = utcToZonedTime(dateTz, COUNT_DOWN_TIMEZONE)
  console.log

  const { days, months } = intervalToDuration({
    start: et,
    end: utcToZonedTime(Date.now(), COUNT_DOWN_TIMEZONE),
  })

  const isLaunched = date
    ? new Date(date) < new Date(Date.now())
    : true

  if (months! > 0 && date === undefined) {
    return <Box />
  } else if (months! === 0 && isLaunched) {
    return (
      <Text bg="violet.base" px={1.5} rounded="4">
        New
      </Text>
    )
  } else if (!isLaunched) {
    return (
      <Text bg="rgba(78, 56, 156, 0.32)" px={1.5} rounded="4">
        In {days} days
      </Text>
    )
  }
  return <Box />
}
