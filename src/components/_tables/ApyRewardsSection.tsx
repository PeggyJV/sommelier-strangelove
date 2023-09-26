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
import { formatDistanceToNowStrict, subDays } from "date-fns"
import { baseApyHoverLabel } from "data/uiConfig"
import { cellarDataMap } from "data/cellarDataMap"
import { CellarType } from "data/types"

type ApyRewardsSectionProps = {
  baseApy?: string
  rewardsApy?: string
  stackingEndDate: string
  date?: Date
  cellarId: string
  baseApySumRewards?: string
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
  const cellarType = cellarDataMap[cellarId].cellarType
  const LogoComponent =
    cellarConfig.customRewardWithoutAPY?.logo ?? LogoIcon
  const isStakingOverrideOngoing = cellarConfig.customRewardWithoutAPY
    ?.stakingDurationOverride
    ? cellarConfig.customRewardWithoutAPY.stakingDurationOverride.getTime() >
      endDate
    : undefined

  if (!baseApy && !rewardsApy) {
    return (
      <Text textAlign="right" fontWeight={550} fontSize="16px">
        --
      </Text>
    )
  }
  // TODO: EXTRACT THIS CODE TO COMPONENTS
  // TODO: Why the conditional logic?
  if (cellarType === CellarType.automatedPortfolio)
    return (
      <Stack alignItems="flex-end" spacing={0}>
        {rewardsApy && (
          <Tooltip
            label={`Rewards ends in ${formatDistanceToNowStrict(
              cellarConfig.customRewardWithoutAPY
                ?.stakingDurationOverride ?? new Date(stackingEndDate)
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
              <Text fontWeight={550} fontSize="16px">
                {rewardsApy}
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
  else
    return (
      <Stack alignItems="flex-end">
        <HStack spacing={0} alignContent="center" gap={1}>
          <Tooltip
            label={
              <>
                <Text>
                  {baseApyHoverLabel(cellarConfig)}{" "}
                  {baseApy ?? "0.00%"}
                </Text>
                <Text>
                  {cellarConfig.customRewardWithoutAPY
                    ?.showSommRewards
                    ? `SOMM Rewards APY ${rewardsApy ?? "0.00%"}`
                    : null}
                </Text>
                <Text>
                  {cellarConfig.customRewardWithoutAPY
                    ?.customRewardAPYTooltip ??
                    `Rewards APY ${rewardsApy ?? "0.00%"}`}
                </Text>
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
          {rewardsApy &&
            (isStakingOverrideOngoing !== undefined &&
              isStakingOverrideOngoing === true) && (
              <Tooltip
                label={`${
                  cellarConfig.customRewardWithoutAPY
                    ?.customIconToolTipMsg ?? "Rewards ends in"
                } ${formatDistanceToNowStrict(
                  cellarConfig.customRewardWithoutAPY
                    ?.stakingDurationOverride ??
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
                      <LogoComponent
                        mx="auto"
                        color="red.normal"
                        p={0}
                        boxSize={
                          cellarConfig.customRewardWithoutAPY
                            ?.logoSize ?? "9px"
                        }
                      />
                    </CircularProgressLabel>
                  </CircularProgress>
                </HStack>
              </Tooltip>
            )}
          {rewardsApy &&
            (cellarConfig.customRewardWithoutAPY?.showSommRewards ===
              undefined ||
              cellarConfig.customRewardWithoutAPY
                ?.showSommRewards) && (
              <Tooltip
                label={`${
                  cellarConfig.customRewardWithoutAPY?.showSommRewards
                    ? "SOMM Rewards ends in"
                    : "Rewards ends in"
                } ${formatDistanceToNowStrict(
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
                        boxSize={"9px"}
                      />
                    </CircularProgressLabel>
                  </CircularProgress>
                </HStack>
              </Tooltip>
            )}
        </HStack>
      </Stack>
    )
}
