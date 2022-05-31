import { Heading, Box, Grid, FlexProps } from "@chakra-ui/react"
import { InlineImage } from "components/InlineImage"
import { ArrowUpIcon } from "components/_icons"
import { CellarCardData } from "./CellarCardDisplay"
import { Label } from "./Label"

interface Props extends FlexProps {
  data: CellarCardData
}

export const Stats: React.FC<Props> = ({ data, children, ...rest }) => {
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
          $10,105.00
        </Heading>
        <Label color="neutral.300">Your Portfolio</Label>
      </Box>
      <Box>
        <Heading
          as="p"
          size="sm"
          fontWeight="bold"
          color="lime.base"
          display="flex"
          alignItems="center"
          columnGap="5px"
        >
          <ArrowUpIcon boxSize={3} />
          {data.apy}%
        </Heading>
        <Label color="neutral.300" whiteSpace="nowrap">
          Past Week
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
          0
        </Heading>
        <Label color="neutral.300">Rewards</Label>
      </Grid>
    </Grid>
  )
}
