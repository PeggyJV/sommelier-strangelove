import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { VaultActionButton } from "components/_buttons/VaultActionButton"
import StrategyRow from "components/_vaults/StrategyRow"
import { InformationIcon } from "components/_icons"
import { AvatarTooltip } from "components/_tooltip/AvatarTooltip"
import { Chain } from "data/chainConfig"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { Token } from "data/tokenConfig"
import { memo, useState } from "react"
import { CellValue } from "react-table"

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

const _AssetAvatarGroup = memo(({ assets }: { assets: Token[] }) => {
  return (
    <AvatarGroup size="sm">
      {assets?.map((asset: Token) => (
        <Avatar
          name={asset?.symbol}
          src={asset?.src}
          key={asset?.symbol}
        />
      ))}
    </AvatarGroup>
  )
})

const ChainAvatar = memo(({ chain }: { chain: Chain }) => (
  <AvatarGroup>
    <Avatar
      name={chain.displayName}
      src={chain.logoPath}
      key={chain.id}
      background={"transparent"}
      border={"none"}
      sx={{
        width: "2.0em",
        height: "2.0em",
      }}
    />
  </AvatarGroup>
))

export const StrategyDesktopColumn = ({
  onDepositModalOpen: _onDepositModalOpen,
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
        if (row.original?.isSommNative) {
          return <StrategyRow vault={row.original} />
        }
        const shortDesc = row.original?.shortDescription
        const providerText =
          row.original?.provider?.title || row.original?.provider
        return (
          <Box>
            <HStack spacing={2}>
              <Text fontWeight="bold">{row.original?.name}</Text>
            </HStack>
            <HStack spacing={2} mt="1">
              {providerText && (
                <Text fontSize="sm" color="whiteAlpha.800">
                  {providerText}
                </Text>
              )}
            </HStack>
            {shortDesc && (
              <Text mt="1" fontSize="sm" color="whiteAlpha.800">
                {shortDesc}
              </Text>
            )}
          </Box>
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
      Header: "TVL",
      accessor: "tvm.value",
      Cell: ({
        row: {
          original: { launchDate, tvm, isHero, isSommNative },
        },
      }: {
        row: {
          original: {
            launchDate: number
            tvm: { value: number; formatted: string }
            isHero: boolean
            isSommNative?: boolean
          }
        }
      }) => {
        if (isSommNative) return null
        return (
          <Text
            fontWeight={550}
            fontSize={isHero ? "20px" : "16px"}
            textAlign="right"
          >
            {launchDate && launchDate > Date.now()
              ? "--"
              : tvm?.formatted ?? "--"}
          </Text>
        )
      },
    },
    {
      Header: () => (
        <Tooltip
          arrowShadowColor="purple.base"
          label="Net rewards inclusive of base yield and any rewards program when active"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack spacing={1}>
            <Text>Net Rewards</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "baseApy",
      Cell: ({ row }: any) => {
        if (row.original?.isSommNative) return null
        const launchDate = row.original.launchDate
        const value = row.original.baseApySumRewards?.formatted
        if (launchDate && launchDate > Date.now()) {
          return (
            <Text fontWeight={550} fontSize="16px" textAlign="right">
              --
            </Text>
          )
        }
        return (
          <Text fontWeight={600} fontSize="16px" textAlign="right">
            {value ?? "--"}
          </Text>
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
        if ((row as any)?.original?.isSommNative) return null
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
            aria-label={`Chain: ${row.original.config.chain.displayName}`}
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            w={"80%"}
          >
            <HStack justifyContent={"right"}>
              <ChainAvatar chain={row.original.config.chain} />
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
        const valA =
          rowA.original.config.chain.displayName.toLowerCase() || ""
        const valB =
          rowB.original.config.chain.displayName.toLowerCase() || ""
        if (valA > valB) return 1
        if (valB > valA) return -1
        return 0
      },
    },
    // Deposit column
    {
      Header: () => <Text>Action</Text>,
      id: "deposit",
      Cell: ({ row }: any) => {
        if (row.original?.isSommNative) return null
        return <VaultActionButton vault={row.original} />
      },
    },
  ]
}
