import {
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react"
import { LogoIcon } from "components/_icons"
import { FC } from "react"
import { subDays } from "date-fns"

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

  const progress = () => {
    const range = endDate - startDate
    const current = now - startDate
    const percentage = (current / range) * 100

    return percentage
  }

  if (!baseApy && !rewardsApy) {
    return (
      <Text w={20} textAlign="right" fontWeight={550} fontSize="16px">
        -
      </Text>
    )
  }
  if (rewardsApy && !rewardsComplete) {
    return (
      <Stack alignItems="flex-end" w={20} spacing={0}>
        <Text fontWeight={550} fontSize="16px">
          {baseApy ?? "-"}
        </Text>
        <HStack spacing={0}>
          <Text fontWeight={600} fontSize="12px" color="neutral.400">
            +{rewardsApy}
          </Text>
          <CircularProgress
            value={progress()}
            color="white"
            trackColor="none"
            size="25px"
          >
            <CircularProgressLabel display="flex" alignItems="center">
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
    )
  }
  return (
    <Text w={20} textAlign="right">
      -
    </Text>
  )
}
