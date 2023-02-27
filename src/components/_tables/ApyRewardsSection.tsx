import {
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { LogoIcon } from "components/_icons"
import { FC } from "react"
import { differenceInDays, subDays } from "date-fns"

type ApyRewardsSectionProps = {
  baseApy?: string
  rewardsApy?: string
  stackingEndDate: string
}

export const ApyRewardsSection: FC<ApyRewardsSectionProps> = (
  props
) => {
  const { baseApy, rewardsApy, stackingEndDate } = props
  const endDate = new Date(stackingEndDate).getTime()
  const startDate = subDays(endDate, 30).getTime()
  const now = new Date(Date.now()).getTime()
  const rewardsComplete = now > endDate
  const range = endDate - startDate
  const current = now - startDate
  const percentage = (current / range) * 100
  const daysLeft = differenceInDays(endDate, now)

  if (!baseApy && !rewardsApy) {
    return (
      <Text textAlign="right" fontWeight={550} fontSize="16px">
        -
      </Text>
    )
  }
  if (rewardsApy && !rewardsComplete) {
    return (
      <Tooltip
        label={`Rewards end in ${daysLeft} days`}
        color="neutral.100"
        border="0"
        fontSize="12px"
        bg="neutral.900"
        fontWeight={600}
        py="4"
        px="6"
        boxShadow="xl"
        shouldWrapChildren
      >
        <Stack alignItems="flex-end" spacing={0}>
          <Text fontWeight={550} fontSize="16px">
            {baseApy ?? "-"}
          </Text>
          <HStack spacing={1}>
            <Text
              fontWeight={600}
              fontSize="12px"
              color="neutral.400"
            >
              +{rewardsApy}
            </Text>
            <CircularProgress
              value={percentage}
              color="white"
              trackColor="none"
              size="25px"
            >
              <CircularProgressLabel
                display="flex"
                alignItems="center"
              >
                <LogoIcon
                  mx="auto"
                  color="red.normal"
                  p={0}
                  boxSize="9px"
                />
              </CircularProgressLabel>
            </CircularProgress>
          </HStack>
        </Stack>
      </Tooltip>
    )
  }
  return (
    <Text textAlign="right" fontWeight={550} fontSize="16px">
      -
    </Text>
  )
}
