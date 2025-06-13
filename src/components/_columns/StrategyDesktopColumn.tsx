import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { DepositAndWithdrawButton } from "components/_buttons/DepositAndWithdrawButton"
import { InformationIcon } from "components/_icons"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { AvatarTooltip } from "components/_tooltip/AvatarTooltip"
import { Timeline } from "data/context/homeContext"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { Token } from "data/tokenConfig"
import { useState } from "react"
import { CellValue } from "react-table"
import { analytics } from "utils/analytics"

type StrategyDesktopColumnProps = {
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
    activeAsset: {
      symbol: string
    }
    config: {
      chain: {
        displayName: string
      }
    }
  }
}

function trackVaultInteraction(vaultName: string) {
  analytics.track("vault.interacted", {
    vault: vaultName,
  })
}

export const StrategyDesktopColumn = ({
  onDepositModalOpen,
}: StrategyDesktopColumnProps) => {
  return [
    {
      Header: () => (
        <span style={{ textAlign: "left", width: "100%" }}>
          Vault
        </span>
      ),
      accessor: "name",
      Cell: ({ row }: any) => {
        return (
          <StrategySection
            icon={row.original.logo}
            onClick={() => trackVaultInteraction(row.original.name)}
            title={row.original.name}
            provider={row.original.provider.title}
            type={row.original.type}
            date={row.original.launchDate}
            description={row.original.description}
            isDeprecated={row.original.deprecated}
            w={56}
            badges={row.original.config.badges}
            isHero={row.original.isHero}
          />
        )
      },
      disableSortBy: false,
      sortType: (rowA: RowData, rowB: RowData) => {
        // Sort by active asset asset
        const valA =
          rowA.original.activeAsset?.symbol.toLowerCase() || ""
        const valB =
          rowB.original.activeAsset?.symbol.toLowerCase() || ""

        // Normal Sorting
        if (valA > valB) return 1

        if (valB > valA) return -1

        return 0
      },
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
          <HStack
            style={{ textAlign: "center", width: "100%" }}
            justifyContent={"center"}
          >
            <Text>Assets</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "tradedAssets",
      Cell: ({ cell: { value } }: CellValue) => {
        const getFirst4Value = value.slice(0, 4)
        const getRemainingValue = value.length - getFirst4Value.length
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
            w={"100%"}
          >
            <HStack justifyContent={"center"}>
              <AvatarGroup size="sm">
                {getFirst4Value?.map((asset: Token) => {
                  return (
                    <Avatar
                      name={asset?.symbol}
                      src={asset?.src}
                      key={asset?.symbol}
                    />
                  )
                })}
              </AvatarGroup>
              {value.length > 6 && (
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
      Header: () => (
        <Tooltip
          arrowShadowColor="purple.base"
          label="The chain the vault is deployed on"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack
            style={{ textAlign: "right", width: "100%" }}
            justifyContent={"right"}
          >
            <Text>Chain</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "chain",
      Cell: ({ cell: { row } }: CellValue) => {
        const [isHover, setIsHover] = useState(false)
        const handleMouseOver = () => {
          setIsHover(true)
        }
        const handleMouseLeave = () => {
          setIsHover(false)
        }
        if (!row)
          return (
            <Text fontWeight={600} fontSize="12px">
              --
            </Text>
          )
        return (
          <Box
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            w={"80%"}
          >
            <HStack justifyContent={"right"}>
              <AvatarGroup>
                <Avatar
                  name={row.original.config.chain.displayName}
                  src={row.original.config.chain.logoPath}
                  key={row.original.config.chain.id}
                  background={"transparent"}
                  border={"none"}
                  sx={{
                    width: "2.0em", // custom width
                    height: "2.0em", // custom height
                  }}
                />
              </AvatarGroup>
            </HStack>
            <Flex alignItems="center" direction="column">
              {isHover && (
                <AvatarTooltip chains={[row.original.config.chain]} />
              )}
            </Flex>
          </Box>
        )
      },
      disableSortBy: false,
      sortType: (rowA: RowData, rowB: RowData) => {
        // Sort by chain
        const valA =
          rowA.original.config.chain.displayName.toLowerCase() || ""
        const valB =
          rowB.original.config.chain.displayName.toLowerCase() || ""

        // Normal Sorting
        if (valA > valB) return 1

        if (valB > valA) return -1

        return 0
      },
    },
    {
      Header: "TVL",
      accessor: "tvm.value",
      Cell: ({
        row: {
          original: { launchDate, tvm, isHero },
        },
      }: {
        row: {
          original: {
            launchDate: number
            tvm: { value: number; formatted: string }
            isHero: boolean
          }
        }
      }) => (
        <Text fontWeight={550} fontSize={isHero ? "20px" : "16px"} textAlign="right">
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
            extraRewardsApy={row.original.extraRewardsApy?.formatted}
            merkleRewardsApy={row.original.merkleRewardsApy}
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
    // Deposit column
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
