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
interface Props extends FlexProps {
  data: CellarCardData
}

export const Stats: React.FC<Props> = ({
  data,
  children,
  ...rest
}) => {
  const { cellarData, userData, aaveV2CellarContract } =
    useAaveV2Cellar()
  const { userStakeData } = useAaveStaker()
  const [netValue, setNetValue] = useState<string>("--")

  useEffect(() => {
    const fn = async () => {
      try {
        const netValue = await aaveV2CellarContract.convertToAssets(
          new BigNumber(userData?.balances?.aaveClr || 0)
            .plus(userStakeData?.totalBondedAmount?.toString() || 0)
            .toFixed()
        )

        const formattedNetValue = toEther(
          netValue.toString(),
          userData?.balances?.aAsset?.decimals,
          false,
          2
        )
        setNetValue(formattedNetValue)
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
          {formatUSD(netValue)}
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
          <Apy apy={data.individualApy} fontSize="inherit" />
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
