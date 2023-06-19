import {
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { LogoIcon } from "components/_icons"
import { FC } from "react"
import { formatDistanceToNowStrict, subDays } from "date-fns"
import { baseApyHoverLabel } from "data/uiConfig"
import { cellarDataMap } from "data/cellarDataMap"

type ApyRewardsSectionProps = {
  baseApy?: string
  rewardsApy?: string
  stackingEndDate: string
  baseApySumRewards?: string
  date?: Date
  cellarId: string
}

export const ApyRewardsSection: FC<ApyRewardsSectionProps> = (
  props
) => {
  const {
    baseApy,
    rewardsApy,
    stackingEndDate,
    cellarId,
    baseApySumRewards,
  } = props
  const endDate = new Date(stackingEndDate).getTime()
  const startDate = subDays(endDate, 30).getTime()
  const now = new Date(Date.now()).getTime()
  const range = endDate - startDate
  const current = now - startDate
  const percentage = (current / range) * 100
  const cellarConfig = cellarDataMap[cellarId].config

  if (!baseApySumRewards) {
    return (
      <Text textAlign="right" fontWeight={550} fontSize="16px">
        --
      </Text>
    )
  }
  return (
    <HStack
      alignItems="center"
      spacing={0}
      alignContent="center"
      gap={2}
    >
      <Tooltip
        label={
          <>
            <Text>
              {baseApyHoverLabel(cellarConfig)} {baseApy ?? "0.00%"}
            </Text>
            <Text>Rewards APY {rewardsApy ?? "0.00%"}</Text>
          </>
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
          {baseApySumRewards ?? "-"}
        </Text>
      </Tooltip>
      {rewardsApy && (
        <Tooltip
          label={`Rewards ends in ${formatDistanceToNowStrict(
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
    </HStack>
  )
}
