import { Heading, Box, Grid, FlexProps } from "@chakra-ui/react"
import { InlineImage } from "components/InlineImage"
import { CellarCardData } from "./CellarCardDisplay"
import { Label } from "./Label"
import { useEffect, useState } from "react"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { useAaveStaker } from "context/aaveStakerContext"
import { BigNumber } from "bignumber.js"
import { toEther, formatUSD } from "utils/formatCurrency"
import { useGetPositionQuery } from "generated/subgraph"
import { useAccount, useConnect } from "wagmi"
import { getPNL } from "utils/pnl"
interface Props extends FlexProps {
  data: CellarCardData
}

export const Stats: React.FC<Props> = ({
  data,
  children,
  ...rest
}) => {
  const [{ data: connectData }] = useConnect()
  const isConnected = connectData.connected
  const { userData, aaveV2CellarContract } = useAaveV2Cellar()
  const { userStakeData } = useAaveStaker()
  const { claimAllRewardsUSD } = userStakeData
  const [cellarShareBalance, setCellarShareBalance] =
    useState<BigNumber>(new BigNumber(0))

  useEffect(() => {
    const fn = async () => {
      try {
        const cellarShareBalance =
          await aaveV2CellarContract.convertToAssets(
            new BigNumber(userData?.balances?.aaveClr || 0)
              .plus(userStakeData?.totalBondedAmount?.toString() || 0)
              .toFixed()
          )
        setCellarShareBalance(cellarShareBalance)
      } catch (e) {
        console.warn("Error converting shares to assets", e)
      }
    }

    void fn()
  }, [
    aaveV2CellarContract,
    userData?.balances?.aAsset?.decimals,
    userData?.balances?.aaveClr,
    userStakeData?.totalBondedAmount,
  ])

  // PNL
  const [{ data: account }] = useAccount()
  const [{ data: positionData }] = useGetPositionQuery({
    variables: {
      walletAddress: account?.address ?? "",
    },
    pause: false,
  })

  const userTvl = new BigNumber(cellarShareBalance?.toString() ?? 0)

  const currentUserDeposits = new BigNumber(
    positionData?.wallet?.currentDeposits ?? 0
  )
  // always 18 decimals from subgraph, must be normalized to 6
  const deposits = currentUserDeposits.div(
    new BigNumber(10).pow(18 - 6)
  )

  const pnl = getPNL(userTvl, deposits)

  // netValue = cellarValue + rewardValue
  let netValue = new BigNumber(
    toEther(
      cellarShareBalance?.toString(),
      userData?.balances?.aAsset?.decimals,
      false,
      2
    )
  )
  if (claimAllRewardsUSD) {
    netValue = netValue.plus(claimAllRewardsUSD)
  }

  const formattedNetValue = netValue.toFixed(2, 0)

  return (
    <Grid
      gridAutoFlow="column"
      gridAutoColumns="min-content"
      gridGap={4}
      background="surface.tertiary"
      padding="12px 16px"
      borderRadius={16}
      {...rest}
    >
      <Box>
        <Heading as="p" size="sm" fontWeight="bold">
          {isConnected ? formatUSD(formattedNetValue) : "--"}
        </Heading>
        <Label color="neutral.300">Your Portfolio</Label>
      </Box>
      {/* TODO: fix PNL bug: https://github.com/strangelove-ventures/sommelier/issues/131 */}
      {/* <Box>
        <Heading
          as="p"
          size="sm"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          columnGap="5px"
        >
          {isConnected ? (
            <Apy apy={pnl.toFixed(1, 0)} fontSize="inherit" />
          ) : (
            "--"
          )}
        </Heading>
        <Label color="neutral.300" whiteSpace="nowrap">
          PNL
        </Label>
      </Box> */}
      <Grid backgroundColor="">
        <Heading
          as="p"
          size="sm"
          fontWeight="bold"
          display="flex"
          alignItems="baseline"
        >
          <InlineImage
            src="/assets/images/coin.png"
            alt="coin logo"
            boxSize={3}
          />
          {isConnected
            ? toEther(
                userStakeData?.totalClaimAllRewards?.toFixed() || "0",
                6,
                false,
                2
              )
            : "--"}
        </Heading>
        <Label color="neutral.300">Rewards</Label>
      </Grid>
    </Grid>
  )
}
