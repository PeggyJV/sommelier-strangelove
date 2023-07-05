import { Text, Tooltip, VStack } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { BaseButton } from "components/_buttons/BaseButton"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { Timeline } from "data/context/homeContext"
import { analytics } from "utils/analytics"
import { useAccount } from "wagmi"
import { formatDistanceStrict, isBefore } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { DepositModalType } from "data/hooks/useDepositModalStore"

type StrategyTabColumnProps = {
  timeline: Timeline
  onDepositModalOpen: ({
    id,
    type,
  }: {
    id: string
    type: DepositModalType
  }) => void
}

export const StrategyTabColumn = ({
  timeline,
  onDepositModalOpen,
}: StrategyTabColumnProps) => {
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
            w={56}
          />
        )
      },
      disableSortBy: true,
    },
    {
      Header: "TVL",
      accessor: "tvm.value",
      Cell: ({ row }: any) => (
        <Text fontWeight={600} fontSize="12px" textAlign="right">
          {row.original.tvm?.formatted}
        </Text>
      ),
    },
    {
      Header: () => (
        <Text>
          Base APY
          <br />& Rewards
        </Text>
      ),
      accessor: "baseApy",
      Cell: ({ row }: any) => {
        return (
          <ApyRewardsSection
            cellarId={row.original.slug}
            baseApy={row.original.baseApy?.formatted}
            rewardsApy={row.original.rewardsApy?.formatted}
            stackingEndDate={row.original.stakingEnd?.endDate}
            date={row.original.launchDate}
            baseApySumRewards={
              row.original.baseApySumRewards?.formatted
            }
          />
        )
      },
    },
    {
      Header: () => (
        <Text>
          {`${timeline.title} Token Price`}
          <br />
          {/* Token Prices */}
        </Text>
      ),
      accessor: `changes.${timeline.value}`,
      Cell: ({ row }: any) => (
        <VStack>
          <Tooltip
            label={`Token price change`}
            color="neutral.100"
            border="0"
            fontSize="12px"
            bg="neutral.900"
            fontWeight={600}
            py="4"
            px="6"
            boxShadow="xl"
            shouldWrapChildren
          >
            <PercentageText
              data={row.original.changes?.[timeline.value]}
              arrowT2
              fontWeight={600}
            />
          </Tooltip>
          {/* <Tooltip
            label={`Token price`}
            color="neutral.100"
            border="0"
            fontSize="12px"
            bg="neutral.900"
            fontWeight={600}
            py="4"
            px="6"
            boxShadow="xl"
            shouldWrapChildren
          >
            <HStack spacing={1}>
              <Text
                fontWeight={600}
                fontSize="12px"
                color="neutral.400"
              >
                {row.original.tokenPrice}
              </Text>
            </HStack>
          </Tooltip> */}
        </VStack>
      ),
      sortType: "basic",
    },
    {
      Header: () => <Text>Deposit</Text>,
      id: "deposit",
      Cell: ({ row }: any) => {
        const date = new Date(row?.original?.launchDate as Date)
        const dateTz = date && zonedTimeToUtc(date, "EST")
        const isBeforeLaunch = isBefore(dateTz, new Date())
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
              row.original.deprecated ||
              !isConnected ||
              !isBeforeLaunch
                ? "inline"
                : "none"
            }
          >
            <BaseButton
              disabled={
                row.original.deprecated ||
                !isConnected ||
                !isBeforeLaunch
              }
              variant="solid"
              onClick={(e) => {
                e.stopPropagation()
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
