import { Text, Tooltip } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { BaseButton } from "components/_buttons/BaseButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import { StrategySection } from "components/_tables/StrategySection"
import { Timeline } from "data/context/homeContext"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { CellValue } from "react-table"
import { analytics } from "utils/analytics"
import { useAccount } from "wagmi"

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
            bg="surface.bg"
            color="neutral.300"
            label={
              row.original.deprecated
                ? "Strategy Deprecated"
                : "Connect your wallet first"
            }
            shouldWrapChildren
            display={
              row.original.deprecated || !isConnected
                ? "inline"
                : "none"
            }
          >
            <BaseButton
              disabled={!isConnected}
              variant="solid"
              onClick={(e) => {
                e.stopPropagation()
                if (row.original.deprecated) {
                  onDepositModalOpen({
                    id: row.original.slug,
                    type: "withdraw",
                  })
                  return
                }
                onDepositModalOpen({
                  id: row.original.slug,
                  type: "deposit",
                })
                analytics.track("home.deposit.modal-opened")
              }}
            >
              {row.original.deprecated ? "Closed" : "Deposit"}
            </BaseButton>
          </Tooltip>
        )
      },
    },
  ]
}
