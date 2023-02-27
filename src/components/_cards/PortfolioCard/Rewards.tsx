import { SimpleGrid, VStack, Text } from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { InlineImage } from "components/InlineImage"
import { Link } from "components/Link"
import { BaseButton } from "components/_buttons/BaseButton"
import { ExternalLinkIcon } from "components/_icons"
import { useGeo } from "context/geoContext"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { ConfigProps } from "data/types"
import { useBrandedToast } from "hooks/chakra"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useHandleTransaction } from "hooks/web3"
import { useImportToken } from "hooks/web3/useImportToken"
import { analytics } from "utils/analytics"
import { config } from "utils/config"
import { useAccount } from "wagmi"

export const Rewards = ({
  cellarConfig,
}: {
  cellarConfig: ConfigProps
}) => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const { data: userData, refetch } = useUserStrategyData(
    cellarConfig.cellar.address
  )
  const { userStakes } = userData || {}
  const { stakerSigner } = useCreateContracts(cellarConfig)
  const { addToast, close } = useBrandedToast()

  const importToken = useImportToken({
    onSuccess: (data) => {
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{data.symbol} added to metamask</Text>,
        closeHandler: close,
      })
    },
    onError: (error) => {
      const e = error as Error
      addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{e.message}</Text>,
        closeHandler: close,
      })
    },
  })
  const userRewards =
    userStakes?.totalClaimAllRewards?.value.toString()

  const claimAllDisabled =
    !isConnected || !userRewards || parseInt(userRewards) <= 0

  const { doHandleTransaction } = useHandleTransaction()

  const geo = useGeo()
  const handleClaimAll = async () => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    analytics.track("rewards.claim-started")
    const tx = await stakerSigner?.claimAll()
    await doHandleTransaction({
      ...tx,
      onSuccess: () => {
        refetch()
        analytics.track("rewards.claim-succeeded")
      },
      onError: () => analytics.track("rewards.claim-failed"),
      toastBody: {
        successWithParams: (result) => {
          const fullImageUrl = `${window.origin}${config.CONTRACT.SOMMELLIER.IMAGE_PATH}`
          return (
            <>
              <Text>Successful</Text>
              <Link
                display="flex"
                alignItems="center"
                href={`https://etherscan.io/tx/${result?.data?.transactionHash}`}
                isExternal
              >
                <Text as="span">View on Etherscan</Text>
                <ExternalLinkIcon ml={2} />
              </Link>
              <Text
                onClick={() => {
                  importToken.mutate({
                    address: config.CONTRACT.SOMMELLIER.ADDRESS,
                    imageUrl: fullImageUrl,
                  })
                }}
                textDecor="underline"
                as="button"
              >
                Import Reward token to wallet
              </Text>
            </>
          )
        },
      },
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
