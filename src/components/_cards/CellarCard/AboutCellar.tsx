import { Text } from "@chakra-ui/react"

import { Stats } from "./Stats"
import { ValueManaged } from "./ValueManaged"

interface Props {
  data?: any
}

export const AboutCellar: React.FC<Props> = ({ data }) => {
  return (
    <>
      <ValueManaged ml={2} mr={2} />
      <Text mb={6} mt={6} ml={2} mr={2}>
        The Aave stablecoin strategy aims to select the optimal
        stablecoin lending position available to lend across Aave
        markets on a continuous basis.
      </Text>
      <Stats mb={2} />
    </>
  )
}
