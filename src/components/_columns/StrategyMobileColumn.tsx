import { Text } from "@chakra-ui/react"
import { StrategySection } from "components/_tables/StrategySection"
import StrategyRow from "components/_vaults/StrategyRow"
import { Badge } from "data/types"

type RowData = {
  original: {
    isSommNative?: boolean
    logo?: string
    name?: string
    provider?: { title?: string } | string
    type?: number
    launchDate?: number | string
    description?: string
    deprecated?: boolean
    config?: { badges?: Badge[] }
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
      Cell: ({ row }: { row: RowData }) => {
        const original = row.original
        if (original?.isSommNative) {
          return (
            <StrategyRow
              vault={
                original as Parameters<typeof StrategyRow>[0]["vault"]
              }
            />
          )
        }
        return (
          <StrategySection
            icon={original.logo ?? ""}
            title={original.name ?? ""}
            provider={
              typeof original.provider === "string"
                ? original.provider
                : original.provider?.title ?? ""
            }
            type={original.type}
            date={
              original.launchDate
                ? String(original.launchDate)
                : undefined
            }
            description={original.description ?? ""}
            isDeprecated={original.deprecated}
            badges={original.config?.badges}
            isSommNative={original.isSommNative}
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
      Cell: ({ row }: { row: RowData }) => {
        const value = row.original.baseApySumRewards?.formatted
        const launchDate = Number(row.original.launchDate ?? 0)
        if (launchDate > Date.now()) {
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
