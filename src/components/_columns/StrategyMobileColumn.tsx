import { Text } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { BaseButton } from "components/_buttons/BaseButton"
import { StrategySection } from "components/_tables/StrategySection"
import { Timeline } from "data/context/homeContext"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { CellValue } from "react-table"
import { analytics } from "utils/analytics"

type StrategyMobileColumnProps = {
  timeline: Timeline
}

export const StrategyMobileColumn = ({
  timeline,
}: StrategyMobileColumnProps) => {
  const { setIsOpen } = useDepositModalStore()

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
      Cell: ({ row }: any) => {
        ;<BaseButton
          variant="solid"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(row.original.slug)

            analytics.track("deposit.modal-opened")
          }}
        >
          Deposit
        </BaseButton>
      },
    },
  ]
}
