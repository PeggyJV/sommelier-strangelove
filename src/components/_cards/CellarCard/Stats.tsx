import { Heading, Box, Grid, FlexProps } from "@chakra-ui/react"
import { Apy } from "components/Apy"
import { InlineImage } from "components/InlineImage"
import { CellarCardData } from "./CellarCardDisplay"
import { Label } from "./Label"
import { useEffect, useState } from "react"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { useAaveStaker } from "context/aaveStakerContext"
import { BigNumber } from "bignumber.js"
import { toEther, formatUSD } from "utils/formatCurrency"
import { useGetPositionQuery } from "generated/subgraph"
import { useAccount } from "wagmi"
import { getPNL } from "utils/pnl"
interface Props extends FlexProps {
  data: CellarCardData
}

export const Stats: React.FC<Props> = ({
  data,
  children,
  ...rest
}) => {
  const { userData, aaveV2CellarContract } = useAaveV2Cellar()
  const { userStakeData } = useAaveStaker()
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

  const formattedNetValue = toEther(
    cellarShareBalance.toString(),
    userData?.balances?.aAsset?.decimals,
    false,
    2
  )

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
          {formatUSD(formattedNetValue)}
        </Heading>
        <Label color="neutral.300">Your Portfolio</Label>
      </Box>
      <Box>
        <Heading
          as="p"
          size="sm"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          columnGap="5px"
        >
          <Apy apy={pnl.toFixed(1, 0)} fontSize="inherit" />
        </Heading>
        <Label color="neutral.300" whiteSpace="nowrap">
          PNL
        </Label>
      </Box>
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
          {toEther(
            userStakeData?.totalClaimAllRewards?.toFixed() || "0",
            6,
            false,
            2
          )}
        </Heading>
        <Label color="neutral.300">Rewards</Label>
      </Grid>
    </Grid>
  )
}
