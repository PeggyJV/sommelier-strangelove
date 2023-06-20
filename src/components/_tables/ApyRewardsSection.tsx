import {
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { LogoIcon } from "components/_icons"
import { cellarDataMap } from "data/cellarDataMap"
import { baseApyHoverLabel } from "data/uiConfig"
import { formatDistanceToNowStrict, subDays } from "date-fns"
import { FC } from "react"

type ApyRewardsSectionProps = {
  baseApy?: string
  rewardsApy?: string
  stackingEndDate: string
  date?: Date
  cellarId: string
}

export const ApyRewardsSection: FC<ApyRewardsSectionProps> = (
  props
) => {
  const { baseApy, rewardsApy, stackingEndDate, cellarId } = props
  const endDate = new Date(stackingEndDate).getTime()
  const startDate = subDays(endDate, 30).getTime()
  const now = new Date(Date.now()).getTime()
  const range = endDate - startDate
  const current = now - startDate
  const percentage = (current / range) * 100
  const cellarConfig = cellarDataMap[cellarId].config

  if (!baseApy && !rewardsApy) {
    return (
      <Text textAlign="right" fontWeight={550} fontSize="16px">
        --
      </Text>
    )
  }
  return (
    <Stack alignItems="flex-end" spacing={0}>
      <Tooltip
        label={
          <VStack>
            <Text fontWeight={600} fontSize="12px">
              {baseApyHoverLabel(cellarConfig)} {baseApy}
            </Text>
            <Text fontWeight={600} fontSize="12px">
              Rewards APY {rewardsApy}
            </Text>
          </VStack>
        }
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
        <Text fontWeight={550} fontSize="16px">
          {baseApy ?? "-"}
        </Text>
      </Tooltip>
      {rewardsApy && (
        <Tooltip
          label={`Ends in ${formatDistanceToNowStrict(
            new Date(stackingEndDate)
          )}`}
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
        </Tooltip>
      )}
    </Stack>
  )
}
