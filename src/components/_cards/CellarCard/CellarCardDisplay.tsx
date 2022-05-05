import {
  Box,
  BoxProps,
  Heading,
  Img,
  Flex,
  useTheme,
} from "@chakra-ui/react"
import { Card } from "components/_cards/Card"
import { Tag } from "components/Tag"
import { AboutCellar } from "./AboutCellar"
import { Burst } from "./Burst"
import { ComingSoon } from "./ComingSoon"

export interface CellarCardData {
  name: string
  description: string
  tvm?: string
  strategyType: string
  managementFee: string
  protocols: string
  apy: string
}

interface CellarCardProps extends BoxProps {
  data: CellarCardData
  isPlaceholder?: boolean
  index?: number
}

export const CellarCardDisplay: React.FC<CellarCardProps> = ({
  data,
  isPlaceholder,
  index,
  ...rest
}) => {
  const theme = useTheme()
  return (
    <Card
      borderRadius={32}
      border="8px solid rgba(78, 56, 156, 0.08)"
      padding="0"
      position="relative"
      display="flex"
      maxW="400px"
      {...rest}
    >
      <Burst />
      <Flex
        flexDirection="column"
        border={`1px solid ${theme.colors.violet.base}`}
        boxShadow={`0 0 1px 0 ${theme.colors.violet.base} inset, 0 0 1px 0 ${theme.colors.violet.base}`}
        borderRadius={24}
        zIndex="2"
      >
        <Box p={4} ml={2} mr={2}>
          <Img src="/assets/images/coin.png" width="40px" mb={3} />
          <Flex mb={2}>
            <Heading size="lg" mr={1} lineHeight="100%">
              {data.name}
            </Heading>
            <Heading size="sm" as="p" color="neutral.300" mt="auto">
              CLR-S
            </Heading>
          </Flex>
          <Flex>
            <Tag>{data.strategyType}</Tag>
            <Tag ml={2}>{data.managementFee}</Tag>
            <Tag ml={2}>{data.protocols}</Tag>
          </Flex>
        </Box>
        <Flex
          p={4}
          backgroundColor="surface.primary"
          position="relative"
          flexGrow="1"
          flexDirection="column"
          paddingTop={isPlaceholder ? 0 : 4}
        >
          {isPlaceholder ? (
            <ComingSoon index={index} />
          ) : (
            <AboutCellar data={data} />
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
