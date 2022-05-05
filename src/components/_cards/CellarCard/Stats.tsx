import { Heading, Box, Flex, Grid, FlexProps } from "@chakra-ui/react"
import { CellarCardData } from "./CellarCardDisplay"
import { Label } from "./Label"

interface Props extends FlexProps {
  data: CellarCardData
}

export const Stats: React.FC<Props> = ({
  data,
  children,
  ...rest
}) => {
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
        <Label>Net Value</Label>
      </Box>
      <Box>
        <Heading as="p" size="sm" fontWeight="bold" color="lime.base">
          {data.apy}%
        </Heading>
        <Label>APY</Label>
      </Box>
      <Grid backgroundColor="">
        <Heading as="p" size="sm" fontWeight="bold">
          0
        </Heading>
        <Label>Rewards</Label>
      </Grid>
    </Grid>
  )
}
