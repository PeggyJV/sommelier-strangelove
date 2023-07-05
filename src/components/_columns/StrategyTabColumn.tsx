import { Text, Tooltip, VStack } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { BaseButton } from "components/_buttons/BaseButton"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { Timeline } from "data/context/homeContext"
import { analytics } from "utils/analytics"
import { useAccount } from "wagmi"

type StrategyTabColumnProps = {
  timeline: Timeline
  onDepositModalOpen: (id: string) => void
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
