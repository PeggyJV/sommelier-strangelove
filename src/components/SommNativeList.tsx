import React from "react"
import { StrategyTable } from "components/_tables/StrategyTable"
import { useSommNativeVaults } from "data/hooks/useSommNativeVaults"

type Props = {
  columns: any
}

export default function SommNativeList({ columns }: Props) {
  const { data } = useSommNativeVaults()
  if (!data || data.length === 0) return null
  return (
    <StrategyTable
      columns={columns}
      data={data as any}
      showHeader={false}
    />
  )
}
