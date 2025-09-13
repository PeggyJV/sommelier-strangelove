import { FC, useMemo } from "react"
import {
  Box,
  HStack,
  Spinner,
  StackProps,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { CardDivider } from "./_layout/CardDivider"
import { CardHeading } from "./_typography/CardHeading"
import { InformationIcon } from "./_icons"
import { Apy } from "./Apy"
import { cellarDataMap } from "data/cellarDataMap"
import { isFuture } from "date-fns"
import { apyHoverLabel, apyLabel } from "data/uiConfig"
import { config as utilConfig } from "utils/config"
import { alphaStethI18n } from "i18n/alphaSteth"
import { formatAlphaStethNetApyNoApprox } from "utils/alphaStethFormat"
import {
  AlphaStethBreakdown,
  type AlphaApyParts,
} from "components/AlphaStethBreakdown"
import { useStrategyData } from "data/hooks/useStrategyData"
import { AlphaApyTooltip } from "components/alpha/AlphaApyTooltip"
import { KpiLabelWithInfo } from "components/alpha/KpiLabelWithInfo"

// Define an interface for APY data which includes the optional 'formatted' property
interface ApyData {
  formatted?: string
}

interface CellarStatsYieldProps extends StackProps {
  cellarId: string
  /** When true, applies Alpha stETH-specific label/tooltip/footnote */
  alphaStethOverrides?: boolean
}

export const CellarStatsYield: FC<CellarStatsYieldProps> = ({
  cellarId,
  alphaStethOverrides,
  ...rest
}) => {
  const cellarConfig = cellarDataMap[cellarId].config
  const borderColor = useBreakpointValue({
    sm: "transparent",
    md: "neutral.700",
  })

  const { data: strategyData, isLoading: isStrategyLoading } =
    useStrategyData(
      cellarConfig.cellar.address,
      cellarConfig.chain.id
    )

  const tvm = strategyData?.tvm
  const stakingEnd = strategyData?.stakingEnd
  const isStakingStillRunning =
    stakingEnd?.endDate && isFuture(stakingEnd?.endDate)
  const baseApy: ApyData = strategyData?.baseApy
    ? (strategyData.baseApy as ApyData)
    : { formatted: undefined }
  const rewardsApy: ApyData = strategyData?.rewardsApy
    ? (strategyData.rewardsApy as ApyData)
    : { formatted: undefined }
  const extraRewardsApy: ApyData = strategyData?.extraRewardsApy
    ? (strategyData.extraRewardsApy as ApyData)
    : { formatted: undefined }
  const merkleRewardsApy: number | undefined =
    strategyData?.merkleRewardsApy
      ? strategyData.merkleRewardsApy
      : undefined

  const baseApySumRewards = strategyData?.baseApySumRewards
  const isAlpha =
    alphaStethOverrides ||
    cellarId === utilConfig.CONTRACT.ALPHA_STETH.SLUG
  const approxApy = useMemo(() => {
    const raw = baseApySumRewards?.formatted
    if (!raw) return undefined
    return formatAlphaStethNetApyNoApprox(raw)
  }, [baseApySumRewards?.formatted])
  const alphaParts: AlphaApyParts = useMemo(() => {
    const parsePct = (s?: string) => {
      if (!s) return 0
      const n = parseFloat(String(s).replace(/%/g, ""))
      return Number.isNaN(n) ? 0 : n
    }
    return {
      baseApy: parsePct(baseApy?.formatted),
      boostApy: parsePct(
        extraRewardsApy?.formatted ?? rewardsApy?.formatted
      ),
      feesImpact: 0,
      netApy: parsePct(baseApySumRewards?.formatted),
      approximate: true,
    }
  }, [
    baseApy?.formatted,
    extraRewardsApy?.formatted,
    rewardsApy?.formatted,
    baseApySumRewards?.formatted,
  ])

  return (
    <HStack
      spacing={{ base: 2, md: 8 }}
      rowGap={4}
      w={{ base: "full", md: "auto" }}
      justifyContent={{ base: "space-between", md: "unset" }}
      divider={
        <CardDivider
          _last={{
            borderColor,
          }}
        />
      }
      {...rest}
    >
      <VStack spacing={1} align="center">
        <Text as="span" fontSize="21px" fontWeight="bold">
          {tvm ? `${tvm?.formatted}` : <Spinner />}
        </Text>
        <Tooltip
          hasArrow
          placement="top"
          label="Total value locked"
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <CardHeading>TVL</CardHeading>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </VStack>
      {baseApySumRewards && (
        <VStack spacing={1} align="center">
          <Apy
            apy={
              isStrategyLoading ? (
                <Spinner />
              ) : isAlpha ? (
                approxApy ?? baseApySumRewards?.formatted
              ) : (
                baseApySumRewards?.formatted
              )
            }
          />
          <Box>
            <Tooltip
              hasArrow
              placement="top"
              label={
                isAlpha ? (
                  <VStack align="start" spacing={1} maxW="320px">
                    <Text fontWeight="semibold">{alphaStethI18n.netApyLabel}</Text>
                    <Text whiteSpace="pre-line">{alphaStethI18n.tooltipBody}</Text>
                    <Text
                      as="a"
                      href={alphaStethI18n.tooltipLinkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      textDecor="underline"
                    >
                      {alphaStethI18n.tooltipLinkText}
                    </Text>
                  </VStack>
                ) : (
                  <>
                    <Text>
                      {apyHoverLabel(cellarConfig)} {baseApy?.formatted ?? "0.00%"}
                    </Text>
                    {cellarConfig.customReward?.showOnlyBaseApy !== undefined &&
                    cellarConfig.customReward?.showOnlyBaseApy === true ? (
                      <></>
                    ) : (
                      <>
                        <Text>
                          {cellarConfig.customReward?.showSommRewards
                            ? `SOMM Rewards APY ${
                                rewardsApy?.formatted ?? "0.00%"
                              }`
                            : null}
                        </Text>
                        <Text>
                          {cellarConfig.customReward?.customRewardAPYTooltip ?? `${
                            cellarConfig.customReward?.showAPY
                              ? `${cellarConfig.customReward.tokenDisplayName} `
                              : ""
                          }Rewards APY ${
                            extraRewardsApy?.formatted ??
                            rewardsApy?.formatted ??
                            "0.00%"
                          }`}
                        </Text>
                      </>
                    )}
                  </>
                )
              }
              bg="surface.bg"
              color="neutral.300"
            >
              <HStack spacing={2} align="center">
                <CardHeading>
                  {isAlpha
                    ? `${alphaStethI18n.netApyLabel}`
                    : apyLabel(cellarConfig)}
                </CardHeading>
                <InformationIcon color="neutral.300" boxSize={3} />
              </HStack>
            </Tooltip>
          </Box>
          {isAlpha && <AlphaStethBreakdown parts={alphaParts} />}
        </VStack>
      )}
    </HStack>
  )
}
