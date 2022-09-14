import { Heading, Box, Grid, FlexProps } from "@chakra-ui/react"
import { InlineImage } from "components/InlineImage"
import { CellarCardData } from "./CellarCardDisplay"
import { Label } from "./Label"
import { useConnect } from "wagmi"
import { cellarDataMap } from "data/cellarDataMap"
import { useOutputUserData } from "src/composite-data/hooks/output/useOutputUserData"
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

  const cellarConfig = cellarDataMap[data.cellarId].config
  const outputUserData = useOutputUserData(cellarConfig)

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
          {isConnected
            ? outputUserData.data.netValue?.formatted || "..."
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
            ? outputUserData.data.totalClaimAllRewards?.formatted ||
              "..."
            : "--"}
        </Heading>
        <Label color="neutral.300">Rewards</Label>
      </Grid>
    </Grid>
  )
}
