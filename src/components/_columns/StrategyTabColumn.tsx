import { Text, Tooltip, HStack, Box, Flex } from "@chakra-ui/react"
import { DepositAndWithdrawButton } from "components/_buttons/DepositAndWithdrawButton"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { InformationIcon } from "components/_icons"
import { Avatar, AvatarGroup } from "@chakra-ui/react"
import { AvatarTooltip } from "components/_tooltip/AvatarTooltip"
import { useState } from "react"
import { CellValue } from "react-table"

type StrategyTabColumnProps = {
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

export const StrategyTabColumn = ({
  onDepositModalOpen,
}: StrategyTabColumnProps) => {
  return [
    {
      Header: () => (
        <span style={{ textAlign: "left", width: "100%" }}>
          Vault
        </span>
      ),
      accessor: "name",
      Cell: ({ row }: any) => (
        <StrategySection
          icon={row.original.logo}
          title={row.original.name}
          provider={row.original.provider.title}
          type={row.original.type}
          date={row.original.launchDate}
          description={row.original.description}
          isDeprecated={row.original.deprecated}
          badges={row.original.config.badges}
          isHero={row.original.isHero}
          isSommNative={row.original.isSommNative}
          w={56}
        />
      ),
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
          label="The chain the vault is deployed on"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack>
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
            w={"100%"}
          >
            <HStack justifyContent={"center"}>
              <AvatarGroup>
                <Avatar
                  name={row.original.config.chain.displayName}
                  src={row.original.config.chain.logoPath}
                  key={row.original.config.chain.id}
                  background={"transparent"}
                  border={"none"}
                  boxShadow={
                    row.original.isHero
                      ? "0 0 15px 5px rgba(147, 51, 234, 0.3)"
                      : "none"
                  }
                  sx={{
                    width: "2.2em", // custom width
                    height: "2.2em", // custom height
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
        // Sort by active asset asset
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
      Cell: ({ row }: any) => (
        <Text
          fontWeight={550}
          fontSize={row.original.isHero ? "20px" : "16px"}
          textAlign="right"
        >
          {row.original.launchDate &&
          row.original.launchDate > Date.now()
            ? "--"
            : row.original.tvm?.formatted ?? "--"}
        </Text>
      ),
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
        const valA = parseFloat(
          rowA.original.baseApySumRewards?.formatted || "0"
        )
        const valB = parseFloat(
          rowB.original.baseApySumRewards?.formatted || "0"
        )
        return valB - valA
      },
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
