import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  HStack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { DepositAndWithdrawButton } from "components/_buttons/DepositAndWithdrawButton"
import { InformationIcon } from "components/_icons"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { AvatarTooltip } from "components/_tooltip/AvatarTooltip"
import { cellarDataMap } from "data/cellarDataMap"
import { Timeline } from "data/context/homeContext"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { Token } from "data/tokenConfig"
import { isTokenPriceEnabledApp } from "data/uiConfig"
import { useState } from "react"
import { CellValue } from "react-table"
import { getProtocols } from "utils/getProtocols"

type StrategyDesktopColumnProps = {
  timeline: Timeline
  onDepositModalOpen: ({
    id,
    type,
  }: {
    id: string
    type: DepositModalType
  }) => void
}
type RowData = {
  original: {
    baseApySumRewards?: {
      formatted?: string
    }
  }
}

export const StrategyDesktopColumn = ({
  timeline,
  onDepositModalOpen,
}: StrategyDesktopColumnProps) => {
  return [
    {
      Header: "Vault",
      accessor: "name",
      Cell: ({ row }: any) => {
        return (
          <StrategySection
            icon={row.original.logo}
            title={row.original.name}
            provider={row.original.provider.title}
            type={row.original.type}
            date={row.original.launchDate}
            description={row.original.description}
            isDeprecated={row.original.deprecated}
            w={56}
            customStrategyHighlight={
              row.original.config.customStrategyHighlight
            }
          />
        )
      },
      disableSortBy: true,
    },
    {
      Header: () => (
        <Tooltip
          arrowShadowColor="purple.base"
          label="Protocols in which Vault operates"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack spacing={1}>
            <Text>Protocols</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "protocols",
      Cell: ({ cell: { value } }: CellValue) => {
        const protocols = typeof value === "string" ? [value] : value
        const getFirst3Value = protocols.slice(0, 3)
        const getRemainingValue =
          protocols.length - getFirst3Value.length
        const [isHover, setIsHover] = useState(false)
        const handleMouseOver = () => {
          setIsHover(true)
        }
        const handleMouseLeave = () => {
          setIsHover(false)
        }
        return (
          <Box
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            w={20}
          >
            <HStack>
              <AvatarGroup size="sm" max={3}>
                {getFirst3Value.map((protocol: string) => {
                  const data = getProtocols(protocol)
                  return (
                    <Avatar
                      name={data.title}
                      src={data.icon}
                      key={data.title}
                      bgColor="white"
                    />
                  )
                })}
              </AvatarGroup>
              {protocols.length > 3 && (
                <Text fontWeight={600}>+{getRemainingValue}</Text>
              )}
            </HStack>
            <Flex alignItems="center" direction="column">
              {isHover && <AvatarTooltip protocols={protocols} />}
            </Flex>
          </Box>
        )
      },
      disableSortBy: true,
    },
    {
      Header: () => (
        <Tooltip
          arrowShadowColor="purple.base"
          label="Vault will have exposure to 1 or more of these assets at any given time"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack spacing={1}>
            <Text>Assets</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "tradedAssets",
      Cell: ({ cell: { value } }: CellValue) => {
        const getFirst3Value = value.slice(0, 3)
        const getRemainingValue = value.length - getFirst3Value.length
        const [isHover, setIsHover] = useState(false)
        const handleMouseOver = () => {
          setIsHover(true)
        }
        const handleMouseLeave = () => {
          setIsHover(false)
        }
        if (!value)
          return (
            <Text fontWeight={600} fontSize="12px">
              --
            </Text>
          )
        return (
          <Box
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            w={20}
          >
            <HStack>
              <AvatarGroup size="sm">
                {getFirst3Value?.map((asset: Token) => {
                  return (
                    <Avatar
                      name={asset?.symbol}
                      src={asset?.src}
                      key={asset?.symbol}
                    />
                  )
                })}
              </AvatarGroup>
              {value.length > 3 && (
                <Text fontWeight={600}>+{getRemainingValue}</Text>
              )}
            </HStack>
            <Flex alignItems="center" direction="column">
              {isHover && <AvatarTooltip tradedAssets={value} />}
            </Flex>
          </Box>
        )
      },
      disableSortBy: true,
    },
    {
      Header: "TVL",
      accessor: "tvm.value",
      Cell: ({
        row: {
          original: { launchDate, tvm },
        },
      }: {
        row: {
          original: {
            launchDate: number
            tvm: { value: number; formatted: string }
          }
        }
      }) => (
        <Text fontWeight={550} fontSize="16px" textAlign="right">
          {launchDate && launchDate > Date.now()
            ? "--"
            : tvm?.formatted ?? "--"}
        </Text>
      ),
    },
    {
      Header: () => (
        <Tooltip
          arrowShadowColor="purple.base"
          label="APY after any platform and strategy provider fees, inclusive of rewards program earnings when an active rewards program is in place"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack spacing={1}>
            <Text>Net APY</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "baseApy",
      Cell: ({ row }: any) => {
        const launchDate = row.original.launchDate
        if (launchDate && launchDate > Date.now()) {
          return (
            <Text fontWeight={550} fontSize="16px" textAlign="right">
              --
            </Text>
          )
        }
        return (
          <ApyRewardsSection
            cellarId={row.original.slug}
            baseApy={row.original.baseApy?.formatted}
            rewardsApy={row.original.rewardsApy?.formatted}
            stackingEndDate={row.original.stakingEnd?.endDate}
            date={row.original.launchDate}
            baseApySumRewards={
              row.original.baseApySumRewards?.formatted
            }
          />
        )
      },
      sortType: (rowA: RowData, rowB: RowData) => {
        // Convert the value to number, if it doesn't exist, default to 0
        const valA = parseFloat(
          rowA.original.baseApySumRewards?.formatted || "0"
        )
        const valB = parseFloat(
          rowB.original.baseApySumRewards?.formatted || "0"
        )

        // Sort from highest to lowest
        return valB - valA
      },
    },
    {
      Header: () => (
        <Text>
          {`${timeline.title} Token Price`}
          <br />
          {/* Token Price */}
        </Text>
      ),
      accessor: `changes.${timeline.value}`,
      Cell: ({ row }: any) => {
        const cellarConfig = cellarDataMap[row.original.slug].config

        if (!isTokenPriceEnabledApp(cellarConfig))
          return (
            <VStack>
              <Tooltip
                label={`Token price change`}
                color="neutral.100"
                border="0"
                fontSize="12px"
                bg="neutral.900"
                fontWeight={600}
                py="4"
                px="6"
                boxShadow="xl"
                shouldWrapChildren
              >
                <PercentageText
                  data={row.original.changes?.[timeline.value]}
                  arrowT2
                  fontWeight={600}
                />
              </Tooltip>
              {/* <Tooltip
  label={`Token price`}
  color="neutral.100"
  border="0"
  fontSize="12px"
  bg="neutral.900"
  fontWeight={600}
  py="4"
  px="6"
  boxShadow="xl"
  shouldWrapChildren
  >
  <HStack spacing={1}>
  <Text
  fontWeight={600}
  fontSize="12px"
  color="neutral.400"
  >
  {row.original.tokenPrice}
  </Text>
  </HStack>
  </Tooltip> */}
            </VStack>
          )

        return (
          <Text fontWeight={550} fontSize="16px" textAlign="center">
            --
          </Text>
        )
      },
      disableSortBy: true,
    },
    {
      Header: () => <Text>Deposit</Text>,
      id: "deposit",
      Cell: ({ row }: any) => (
        <DepositAndWithdrawButton
          row={row}
          onDepositModalOpen={onDepositModalOpen}
        />
      ),
    },
  ]
}
