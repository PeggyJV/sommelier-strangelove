import { Text } from "@chakra-ui/react"
import { StrategySection } from "components/_tables/StrategySection"
import StrategyRow from "components/_vaults/StrategyRow"
import { Timeline } from "data/context/homeContext"
import { DepositModalType } from "data/hooks/useDepositModalStore"

type RowData = {
  original: {
    baseApySumRewards?: {
      formatted?: string
    }
    activeAsset: {
      symbol: string
    }
  }
}

export const StrategyMobileColumn = () => {
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
        return (
          <StrategySection
            icon={row.original.logo}
            title={row.original.name}
            provider={row.original.provider.title}
            type={row.original.type}
            date={row.original.launchDate}
            description={row.original.description}
            isDeprecated={row.original.deprecated}
            badges={row.original.config.badges}
            isSommNative={row.original.isSommNative}
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
      Header: () => <Text>Net Rewards</Text>,
      accessor: "baseApy",
      Cell: ({ row }: any) => {
        const value = row.original.baseApySumRewards?.formatted
        const launchDate = row.original.launchDate
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
    },
  ]
}
