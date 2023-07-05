import { Text, Tooltip } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { BaseButton } from "components/_buttons/BaseButton"
import { StrategySection } from "components/_tables/StrategySection"
import { Timeline } from "data/context/homeContext"
import { CellValue } from "react-table"
import { analytics } from "utils/analytics"
import { useAccount } from "wagmi"

type StrategyMobileColumnProps = {
  timeline: Timeline
  onDepositModalOpen: (id: string) => void
}

export const StrategyMobileColumn = ({
  timeline,
  onDepositModalOpen,
}: StrategyMobileColumnProps) => {
  const { isConnected } = useAccount()
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
        return (
          <Tooltip
            label={
              !isConnected
                ? "Connect your wallet first"
                : "Strategy Deprecated"
            }
            shouldWrapChildren
            display={
              row.original.deprecated || !isConnected
                ? "inline"
                : "none"
            }
          >
            <BaseButton
              disabled={row.original.deprecated || !isConnected}
              variant="solid"
              onClick={(e) => {
                e.stopPropagation()
                onDepositModalOpen(row.original.slug)
                analytics.track("deposit.modal-opened")
              }}
            >
              Deposit
            </BaseButton>
          </Tooltip>
        )
      },
    },
  ]
}
