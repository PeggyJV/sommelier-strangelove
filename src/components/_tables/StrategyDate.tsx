import { Text } from "@chakra-ui/react"
import { add, formatDistanceStrict, isBefore } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { isComingSoon } from "utils/isComingSoon"

type StrategyDateProps = {
  date?: string
  deprecated?: boolean
}
export const StrategyDate = (props: StrategyDateProps) => {
  // After launch until 1 month = new
  // before launch = launch date - date now
  // after launch more than 1 month = none
  const { date } = props
  const comingSoon = date && isComingSoon(new Date(date))
  const dateTz = date && zonedTimeToUtc(date, "EST")

  const isNew =
    date && isBefore(new Date(date), add(new Date(), { weeks: 4 }))

  if (props.deprecated) {
    return (
      <Text bg="gray" px={1.5} rounded="4">
        Deprecated
      </Text>
    )
  }

  if (!!comingSoon) {
    return (
      <Text bg="rgba(78, 56, 156, 0.32)" px={1.5} rounded="4">
        in {dateTz && formatDistanceStrict(dateTz, new Date())}
      </Text>
    )
  } else if (isNew) {
    return (
      <Text bg="violet.base" px={1.5} rounded="4">
        New
      </Text>
    )
  }
  return null
}
