import {
  VStack,
  Heading,
  HStack,
  Text,
  Link,
  Icon,
} from "@chakra-ui/react"
import { format, utcToZonedTime } from "date-fns-tz"
import { FC } from "react"
import Countdown from "react-countdown"
import { FiArrowRight } from "react-icons/fi"
import { COUNT_DOWN_TIMEZONE } from "utils/config"

interface CountDownProps {
  launchDate: Date
  isTwoDaysAfterLaunch?: boolean
}

const pad = (d: number) => {
  return d < 10 ? "0" + d.toString() : d.toString()
}

export const CountDown: FC<CountDownProps> = ({
  launchDate,
  isTwoDaysAfterLaunch,
}) => {
  const et = utcToZonedTime(launchDate, COUNT_DOWN_TIMEZONE)
  const day = format(et, "iii MMM d")
  const hour = format(et, "h:mmaaa")

  return (
    <VStack
      background="surface.secondary"
      padding="30px 16px"
      borderRadius={40}
      textAlign="center"
      maxW="40rem"
    >
      <Text fontWeight="bold" color="neutral.300">
        {isTwoDaysAfterLaunch
          ? "Early Yielder program"
          : "Launching on"}
      </Text>
      <Heading fontSize={isTwoDaysAfterLaunch ? "25px" : "36px"}>
        {isTwoDaysAfterLaunch
          ? "Deposit before the deadline to maximize rewards and minimize gas fees."
          : day}
      </Heading>
      <Text fontWeight="bold">
        {isTwoDaysAfterLaunch ? (
          <Link
            isExternal
            href="https://medium.com/@sommelier.finance/maximize-rewards-and-minimize-fees-by-becoming-an-early-yielder-16fc24a6dd6"
            display="flex"
            gap={1}
            alignItems="center"
            onClick={() => {
              // analytics.track("click.early-yielder-program")
              return null
            }}
          >
            How it works
            <Icon as={FiArrowRight} size="xl" w={4} h={4} />
          </Link>
        ) : (
          `${hour} ${COUNT_DOWN_TIMEZONE}`
        )}
      </Text>
      <HStack
        w="full"
        padding={6}
        backgroundColor="surface.tertiary"
        justifyContent="space-between"
        borderRadius="24px"
        fontWeight="semibold"
        color="white"
        fontSize="24px"
        divider={<Text>:</Text>}
        maxW="20rem"
      >
        <Countdown
          date={launchDate}
          zeroPadDays={2}
          zeroPadTime={2}
          renderer={({
            days,
            hours,
            minutes,
            seconds,
            completed,
          }) => {
            if (completed) {
              return null
            }

            return (
              <>
                <Text w="4ch">{pad(days)}d</Text>
                <Text w="4ch">{pad(hours)}h</Text>
                <Text w="4ch">{pad(minutes)}m</Text>
                <Text w="4ch">{pad(seconds)}s</Text>
              </>
            )
          }}
        />
      </HStack>
    </VStack>
  )
}
