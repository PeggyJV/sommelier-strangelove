import { Box, Text } from "@chakra-ui/react"
import { intervalToDuration } from "date-fns"

type StrategyDateProps = {
  date?: string
}
export const StrategyDate = (props: StrategyDateProps) => {
  // After launch until 1 month = new
  // before launch = launch date - date now
  // after launch more than 1 month = none
  const { date } = props
  const { days, months } = intervalToDuration({
    start: new Date(date ?? 0),
    end: new Date(Date.now()),
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
