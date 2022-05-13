import { Box, BoxProps, Heading, Img, Flex, useTheme } from "@chakra-ui/react"
import { Card } from "components/_cards/Card"
import { Tag } from "components/Tag"
import { AboutCellar } from "./AboutCellar"
import { Burst } from "./Burst"
import { ComingSoon } from "./ComingSoon"
import { useMemo } from "react"
import { InlineImage } from "components/InlineImage"

export interface CellarCardData {
  id: string
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

enum Protocols {
  avve = "AAVE",
}

export const CellarCardDisplay: React.FC<CellarCardProps> = ({
  data,
  isPlaceholder,
  index,
  ...rest
}) => {
  const theme = useTheme()

  const protocolIcon = useMemo(() => {
    switch (data.protocols) {
      case Protocols.avve:
        return "aave"
    }
  }, [data.protocols])

  return (
    <Card
      borderRadius={32}
      borderWidth={8}
      borderColor="surface.primary"
      padding="0"
      position="relative"
      display="flex"
      maxW="400px"
      {...rest}
    >
      <Burst />
      <Flex
        flexDirection="column"
        borderWidth={1}
        borderColor="purple.base"
        boxShadow={`
          0 0 1px 0 ${theme.colors.purple.base} inset,
          0 0 1px 0 ${theme.colors.purple.base}
        `}
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
            <Tag ml={2}>
              {data.managementFee} {data.managementFee !== "-" && "Fee"}
            </Tag>
            <Tag ml={2} display="flex" alignItems="center">
              {protocolIcon && (
                <InlineImage
                  src={`/assets/icons/${protocolIcon}.png`}
                  alt="aave logo"
                  boxSize={4}
                />
              )}
              {data.protocols}
            </Tag>
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
