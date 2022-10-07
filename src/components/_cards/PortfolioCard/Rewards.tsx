import { SimpleGrid, VStack } from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { InlineImage } from "components/InlineImage"
import { BaseButton } from "components/_buttons/BaseButton"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserStakes } from "data/hooks/useUserStakes"
import { ConfigProps } from "data/types"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useHandleTransaction } from "hooks/web3"
import { analytics } from "utils/analytics"
import { useAccount } from "wagmi"

export const Rewards = ({
  cellarConfig,
}: {
  cellarConfig: ConfigProps
}) => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const { data: userStakes, refetch } = useUserStakes(cellarConfig)
  const { stakerSigner } = useCreateContracts(cellarConfig)

  const userRewards =
    userStakes?.totalClaimAllRewards?.value.toString()

  const claimAllDisabled =
    !isConnected || !userRewards || parseInt(userRewards) <= 0

  const { doHandleTransaction } = useHandleTransaction()

  const handleClaimAll = async () => {
    analytics.track("rewards.claim-started")
    const tx = await stakerSigner?.claimAll()
    await doHandleTransaction({
      ...tx,
      onSuccess: () => analytics.track("rewards.claim-succeeded"),
      onError: () => analytics.track("rewards.claim-failed"),
    })
    refetch()
  }
  return (
    <SimpleGrid
      templateColumns="max-content"
      templateRows="repeat(2, 1fr)"
      spacing={4}
      alignItems="flex-end"
    >
      <VStack align="flex-start">
        <CardStat
          label="rewards"
          tooltip="Amount of SOMM earned and available to be claimed"
        >
          <InlineImage
            src="/assets/icons/somm.png"
            alt="sommelier logo"
            boxSize={5}
          />
          {isMounted &&
            (isConnected
              ? userStakes?.totalClaimAllRewards.formatted || "..."
              : "--")}
        </CardStat>
      </VStack>
      <BaseButton
        disabled={claimAllDisabled}
        onClick={handleClaimAll}
      >
        Claim All
      </BaseButton>
    </SimpleGrid>
  )
}
