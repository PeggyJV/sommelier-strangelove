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
import { Label } from "./Label"
import { Stats } from "./Stats"
import { ValueManaged } from "./ValueManaged"

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
      <Img
        src="/assets/images/burst.png"
        width="160px"
        position="absolute"
        right="-33px"
        top="-58px"
        zIndex="1"
      />
      <Box
        border="1px solid rgba(237, 74, 125, 1)"
        borderRadius={24}
        padding="1rem"
        zIndex="2"
      >
        <Img src="/assets/images/coin.png" width="40px" />
        <Heading>aave2</Heading>
        <Flex>
          <Tag>Stable</Tag>
          <Tag>Stable</Tag>
          <Tag>Stable</Tag>
        </Flex>
        <ValueManaged />
        <Text mb={6} mt={6}>
          The Aave stablecoin strategy aims to select the optimal
          stablecoin lending position available to lend across Aave
          markets on a continuous basis.
        </Text>
        <Stats />
      </Box>
    </Card>
  )
}
