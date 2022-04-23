import {
  Box,
  BoxProps,
  Heading,
  Img,
  Flex,
  Text,
} from "@chakra-ui/react"
import { Card } from "components/_cards/Card"
import { Tag } from "components/Tag"
import { Stats } from "./Stats"
import { ValueManaged } from "./ValueManaged"
import { Burst } from "./Burst"

interface CellarCardProps extends BoxProps {
  data?: any
  isPlaceholder?: boolean
  index?: number
}

export const CellarCard: React.FC<CellarCardProps> = ({
  data,
  ...rest
}) => {
  console.log("data", data)
  return (
    <Card
      borderRadius={32}
      border="8px solid rgba(78, 56, 156, 0.08)"
      padding="0"
      position="relative"
      {...rest}
    >
      <Burst />
      <Box
        border="1px solid rgba(237, 74, 125, 1)"
        borderRadius={24}
        zIndex="2"
      >
        <Box p={4} ml={2} mr={2}>
          <Img src="/assets/images/coin.png" width="40px" />
          <Heading>aave2</Heading>
          <Flex>
            <Tag>Stable</Tag>
            <Tag ml={2}>5.0%</Tag>
            <Tag ml={2}>AAVE</Tag>
          </Flex>
        </Box>
        <Box p={4} backgroundColor="surface.primary">
          <ValueManaged ml={2} mr={2} />
          <Text mb={6} mt={6} ml={2} mr={2}>
            The Aave stablecoin strategy aims to select the optimal
            stablecoin lending position available to lend across Aave
            markets on a continuous basis.
          </Text>
          <Stats mb={2} />
        </Box>
      </Box>
    </Card>
  )
}
