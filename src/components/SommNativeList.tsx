import React from "react"
import { StrategyTable } from "components/_tables/StrategyTable"
import { useSommNativeVaults } from "data/hooks/useSommNativeVaults"

type Props = {
  columns: React.ComponentProps<typeof StrategyTable>["columns"]
  data?: React.ComponentProps<typeof StrategyTable>["data"]
}

export default function SommNativeList({
  columns,
  data: propData,
}: Props) {
  const { data: hookData } = useSommNativeVaults()
  const data = propData ?? hookData
  if (!data || data.length === 0) return null
  return (
    <StrategyTable
      columns={columns}
      data={data}
      showHeader={false}
    />
  )
}
