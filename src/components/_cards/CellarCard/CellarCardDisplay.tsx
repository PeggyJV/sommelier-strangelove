import { Box, BoxProps, Heading, Img, Flex } from "@chakra-ui/react"
import { Card } from "components/_cards/Card"
import { Tag } from "components/Tag"
import { AboutCellar } from "./AboutCellar"
import { Burst } from "./Burst"
import { ComingSoon } from "./ComingSoon"
import { InlineImage } from "components/InlineImage"

export interface CellarCardData {
  cellarId: string
  name: string
  description: string
  tvm?: string
  strategyType: string
  managementFee: string
  protocols: string
  individualApy: string
  cellarApy: string
}

interface CellarCardProps extends BoxProps {
  data: CellarCardData
  isPlaceholder?: boolean
  index?: number
}

const baseIconPath = "/assets/icons"
const protocols: { [key: string]: string } = {
  AAVE: `${baseIconPath}/aave.png`,
}

export const CellarCardDisplay: React.FC<CellarCardProps> = ({
  data,
  isPlaceholder,
  index,
  ...rest
}) => {
  const protocolIcon = protocols[data.protocols]

  return (
    <Card
      padding="0"
      position="relative"
      display="flex"
      maxW="400px"
      boxShadow="0 0 0 1px rgba(78, 56, 156, 0.16)"
      borderRadius={24}
      _hover={{
        backgroundColor: "surface.tertiary",
        boxShadow: "0 0 0 2px #6C4ED9",
      }}
      {...rest}
    >
      <Burst />
      <Flex flexDirection="column" borderRadius={24} zIndex="2">
        <Box
          p={4}
          ml={2}
          bg="radial-gradient(104.22% 1378.1% at 0% 0%, rgba(194, 34, 194, 0) 0%, rgba(210, 37, 204, 0.16) 100%)"
          borderTopRightRadius={24}
          borderTopLeftRadius={24}
        >
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
              {data.managementFee}{" "}
              {data.managementFee !== "..." && "Fee"}
            </Tag>
            <Tag ml={2} display="flex" alignItems="center">
              {protocolIcon && (
                <InlineImage
                  src={protocolIcon}
                  alt="aave logo"
                  boxSize={4}
                />
              )}
              {data.protocols}
            </Tag>
          </Flex>
        </Box>
        <Flex
          p="16px 16px 24px"
          backgroundColor="surface.primary"
          borderBottomRightRadius={24}
          borderBottomLeftRadius={24}
          position="relative"
          flexGrow="1"
          flexDirection="column"
          justifyContent="space-evenly"
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
