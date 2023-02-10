import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Table,
  TableCellProps,
  TableContainer,
  TableRowProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { VFC } from "react"

import { tokenConfig } from "data/tokenConfig"

import { protocolsImage } from "utils/protocolsImagePath"
export const BorderTr: VFC<TableRowProps> = (props) => {
  return (
    <Tr
      _notLast={{
        borderBottom: "1px solid",
        borderColor: "surface.secondary",
      }}
      _first={{
        td: {
          _first: {
            borderTopLeftRadius: 20,
          },
          _last: {
            borderTopRightRadius: 20,
          },
        },
      }}
      _last={{
        td: {
          _first: {
            borderBottomLeftRadius: 20,
          },
          _last: {
            borderBottomRightRadius: 20,
          },
        },
      }}
      {...props}
    />
  )
}

export const BorderTd: VFC<TableCellProps> = (props) => {
  return <Td {...props} />
}

export type StrategyTableProps = {
  strategies: {
    title: string
    type: string
    provider: string
    launchDate: Date
    protocols: string[]
    strategyAssets: string[]
    tvm: string
    baseApy: string
    oneDay: number
    icon: string
  }[]
}

export const StrategyTable: VFC<StrategyTableProps> = ({
  strategies,
}) => {
  const getTradedAssets = (item: string) => {
    const asset = tokenConfig.find((v) => v.symbol === item)
    return asset
  }
  const getProtocols = (protocols: string) => {
    return {
      title: protocols,
      icon: protocolsImage[protocols],
    }
  }
  return (
    <TableContainer>
      <Table
        variant="unstyled"
        sx={{
          borderCollapse: "collapse",
        }}
      >
        <Thead border="none" color="neutral.400">
          <BorderTr>
            <Th textTransform="unset">Strategy</Th>
            <Th textTransform="unset">Protocols</Th>
            <Th textTransform="unset">Assets</Th>
            <Th textTransform="unset">TVM</Th>
            <Th textTransform="unset">Base APY</Th>
            <Th textTransform="unset">1D</Th>
          </BorderTr>
        </Thead>
        <Tbody backgroundColor="surface.primary">
          {strategies.map((strategy) => (
            <BorderTr key={strategy.title}>
              <BorderTd>
                <Stack direction="row" alignItems="center">
                  <Image
                    boxSize="45px"
                    src={strategy.icon}
                    rounded="full"
                    alt="strategy icon"
                  />
                  <Box>
                    <Heading fontSize="1rem">
                      {strategy.title}
                    </Heading>
                    <Flex
                      gap={1}
                      alignItems="center"
                      fontSize="0.75rem"
                      fontWeight={600}
                    >
                      <Text
                        bg="rgba(78, 56, 156, 0.32)"
                        px={1.5}
                        rounded="4"
                      >
                        In 3 days
                      </Text>
                      <Text color="neutral.400">
                        Patache.Portofolio
                      </Text>
                    </Flex>
                  </Box>
                </Stack>
              </BorderTd>
              <BorderTd>
                <AvatarGroup size="sm" max={3}>
                  {strategy.protocols.map((protocol) => {
                    const data = getProtocols(protocol)
                    return (
                      <Avatar
                        name={data.title}
                        src={data.icon}
                        key={data.title}
                      />
                    )
                  })}
                </AvatarGroup>
              </BorderTd>
              <BorderTd>
                <AvatarGroup size="sm" max={3}>
                  {strategy.strategyAssets.map((protocol) => {
                    const data = getTradedAssets(protocol)
                    return (
                      <Avatar
                        name={data?.symbol}
                        src={data?.src}
                        key={data?.symbol}
                      />
                    )
                  })}
                </AvatarGroup>
              </BorderTd>
              <BorderTd fontWeight={600} fontSize="12px">
                {strategy.tvm}
              </BorderTd>
              <BorderTd>{strategy.baseApy}</BorderTd>
              <BorderTd>{strategy.oneDay}%</BorderTd>
            </BorderTr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
