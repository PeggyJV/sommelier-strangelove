import { Heading, Box, Grid, FlexProps } from "@chakra-ui/react"
import { InlineImage } from "components/InlineImage"
import { CellarCardData } from "./CellarCardDisplay"
import { Label } from "./Label"
import { useAccount } from "wagmi"
import { cellarDataMap } from "data/cellarDataMap"
import { isRewardsEnabled } from "data/uiConfig"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
interface Props extends FlexProps {
  data: CellarCardData
}

export const UserStats: React.FC<Props> = ({
  data,
  children,
  ...rest
}) => {
  const { isConnected } = useAccount()

  const cellarConfig = cellarDataMap[data.cellarId].config
  const { data: userData } = useUserStrategyData(
    cellarConfig.cellar.address, cellarConfig.chain.id
  )
  const netValue = userData?.userStrategyData.userData.netValue
  const userStakes = userData?.userStakes
  const isMounted = useIsMounted()

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
          {isMounted && isConnected
            ? netValue?.formatted || "..."
            : "--"}
        </Heading>
        <Label color="neutral.300">Your Portfolio</Label>
      </Box>
      {/* TODO: Verify PNL result */}
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
            <Apy
              apy={
                (outputUserData.data.pnl &&
                  outputUserData.data.pnl?.formatted) ||
                "..."
              }
              fontSize="inherit"
            />
          ) : (
            "--"
          )}
        </Heading>
        <Label color="neutral.300" whiteSpace="nowrap">
          PNL
        </Label>
      </Box> */}
      {isRewardsEnabled(cellarConfig) && (
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
            {isMounted && isConnected
              ? userStakes?.totalClaimAllRewards.formatted || "..."
              : "--"}
          </Heading>
          <Label color="neutral.300">Rewards</Label>
        </Grid>
      )}
    </Grid>
  )
}
