import { Text } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { DepositAndWithdrawButton } from "components/_buttons/DepositAndWithdrawButton"
import { StrategySection } from "components/_tables/StrategySection"
import { Timeline } from "data/context/homeContext"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { CellValue } from "react-table"

type StrategyMobileColumnProps = {
  timeline: Timeline
  onDepositModalOpen: ({
    id,
    type,
  }: {
    id: string
    type: DepositModalType
  }) => void
}

export const StrategyMobileColumn = ({
  timeline,
  onDepositModalOpen,
}: StrategyMobileColumnProps) => {
  return [
    {
      Header: "Strategy",
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
          />
        )
      },
      disableSortBy: true,
    },
    {
      Header: timeline.title,
      accessor: `changes.${timeline.value}`,
      Cell: ({ cell: { value } }: CellValue) => (
        <PercentageText data={value} arrowT2 fontWeight={600} />
      ),
      sortType: "basic",
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
