import { BigNumber } from "bignumber.js"
import { CellarDayData } from "generated/subgraph"

const SECS_DAY = 60 * 60 * 24

type ExpectedApyResult = {
  expectedApy: BigNumber
  formattedApy: string
  formattedCellarApy: string
  formattedStakingApy: string
}

const zeroBN = new BigNumber(0)
export function getExpectedApy(
  cellarApy: BigNumber | undefined,
  stakingApy: BigNumber | undefined,
  precision = 1
): ExpectedApyResult {
  let expectedApy = zeroBN
  if (cellarApy && stakingApy) {
    expectedApy = cellarApy.plus(stakingApy)
  }

  const formattedApy = expectedApy.toFixed(precision)
  const formattedCellarApy = cellarApy
    ? cellarApy.toFixed(precision)
    : "-"
  const formattedStakingApy = stakingApy
    ? stakingApy.toFixed(precision)
    : "-"

  return {
    expectedApy,
    formattedApy,
    formattedCellarApy,
    formattedStakingApy,
  }
}

export function dailyApy(day: Partial<CellarDayData>): BigNumber {
  const invested = new BigNumber(day.tvlInvested)
  const earnings = new BigNumber(day.earnings)
  if (invested.isZero() || earnings.isZero()) return new BigNumber(0)

  const ratio = earnings.div(invested)
  const apy = ratio.plus(1).pow(365).minus(1).multipliedBy(100)

  return apy
}

export function averageApy(
  days: Partial<CellarDayData>[]
): BigNumber {
  const apy = days
    .map(dailyApy)
    .reduce(
      (total: BigNumber, apy: BigNumber) => total.plus(apy),
      new BigNumber(0)
    )
    .div(days.length)

  return apy
}

export function todayEpochSeconds(): number {
  const nowSec = Math.floor(new Date().getTime() / 1000)
  const seconds = Math.floor(nowSec / SECS_DAY) * SECS_DAY

  return seconds
}

export function filterToday(day: Partial<CellarDayData>): boolean {
  const today = todayEpochSeconds()
  const todayFiltered = day.date !== today

  return todayFiltered
}

export function calculateApy(
  days: Partial<CellarDayData>[]
): BigNumber {
  const filtered = days.filter(filterToday)
  const apy = averageApy(filtered)

  return apy
}

export function averageTvlActive(
  days: Partial<CellarDayData>[],
  tvlActive: string
) {
  return days
    .reduce(
      (total: BigNumber, day: Partial<CellarDayData>) =>
        total.plus(day.tvlActive),
      new BigNumber(0)
    )
    .div(tvlActive)
    .toNumber()
}
