import { Heading, Box, Flex, Grid, FlexProps } from "@chakra-ui/react"
import { Label } from "./Label"

export const Stats: React.FC<FlexProps> = ({ children, ...rest }) => {
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
        <Heading as="p" size="sm" fontWeight="bold" color="lime">
          $1.00%
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
