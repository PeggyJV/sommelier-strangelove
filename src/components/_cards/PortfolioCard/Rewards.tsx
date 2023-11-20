import { SimpleGrid, VStack, Text, HStack } from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { InlineImage } from "components/InlineImage"
import { Link } from "components/Link"
import { BaseButton } from "components/_buttons/BaseButton"
import { ExternalLinkIcon } from "components/_icons"
import { useGeo } from "context/geoContext"
import { chainConfig } from "data/chainConfig"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { tokenConfig } from "data/tokenConfig"
import { ConfigProps } from "data/types"
import { useBrandedToast } from "hooks/chakra"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useHandleTransaction } from "hooks/web3"
import { useImportToken } from "hooks/web3/useImportToken"
import { analytics } from "utils/analytics"
import { config } from "utils/config"
import { useAccount } from "wagmi"
import { useNetwork } from "wagmi"

export const Rewards = ({
  cellarConfig,
}: {
  cellarConfig: ConfigProps
}) => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const { data: userData, refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )
  const { userStakes } = userData || {}
  const { stakerSigner } = useCreateContracts(cellarConfig)
  const { addToast, close } = useBrandedToast()

  const { chain: wagmiChain } = useNetwork()
  let buttonsEnabled = true
  if (cellarConfig.chain.wagmiId !== wagmiChain?.id!) {
    buttonsEnabled = false
  }

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
    !isConnected || !userRewards || parseInt(userRewards) <= 0 || !buttonsEnabled

  // Get somm token
  const chainObj = chainConfig.find(
    (c) => c.id === cellarConfig.chain.id
  )!

  const sommToken = tokenConfig.find(
    (t) => t.coinGeckoId === "sommelier" && t.chain === chainObj.id
  )!

  let rewardTokenAddress = sommToken.address
  let rewardTokenImageUrl = sommToken.src
  let rewardTokenName = sommToken.symbol

  // Custom processing for if reward is not SOMM
  // -- Check if cellar config has customReward field
  if (
    cellarConfig.customReward &&
    cellarConfig.customReward.showAPY === false
  ) {
    rewardTokenAddress = cellarConfig.customReward.tokenAddress
    rewardTokenImageUrl = cellarConfig.customReward.imagePath
    rewardTokenName = cellarConfig.customReward.tokenSymbol
  }

  const { doHandleTransaction } = useHandleTransaction()

  const geo = useGeo()
  const handleClaimAll = async () => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    // analytics.track("rewards.claim-started")
    const tx = await stakerSigner?.claimAll()
    await doHandleTransaction({
      cellarConfig,
      ...tx,
      onSuccess: () => {
        refetch()
        analytics.track("rewards.claim-succeeded")
      },
      onError: () => analytics.track("rewards.claim-failed"),
      toastBody: {
        successWithParams: (result) => {
          const fullImageUrl = `${window.origin}${rewardTokenImageUrl}`
          return (
            <>
              <Text>Successful</Text>
              <Link
                display="flex"
                alignItems="center"
                href={`${cellarConfig.chain.blockExplorer.url}/tx/${result?.data?.transactionHash}`}
                isExternal
              >
                <Text as="span">{`View on ${cellarConfig.chain.blockExplorer.name}`}</Text>
                <ExternalLinkIcon ml={2} />
              </Link>
              <Text
                onClick={() => {
                  importToken.mutate({
                    address: rewardTokenAddress,
                    imageUrl: fullImageUrl,
                    chain: cellarConfig.chain.id,
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
      templateRows={
        cellarConfig.customReward?.showSommRewards
          ? ""
          : "repeat(2, 1fr)"
      }
      spacing={4}
      alignItems="flex-end"
      //display={claimAllDisabled ? "none" : "grid"}
    >
      <VStack align="flex-start">
        {cellarConfig.customReward?.showBondingRewards ? (
          <HStack>
            <a
              href={cellarConfig?.customReward?.rewardHyperLink}
              target="_blank"
              rel="noreferrer"
              title={
                cellarConfig?.customReward?.customRewardMessageTooltip
              }
            >
              <CardStat
                label={
                  cellarConfig?.customReward?.customRewardHeader ??
                  "rewards"
                }
                tooltip={
                  cellarConfig?.customReward
                    ?.customRewardMessageTooltip ??
                  `Amount of ${rewardTokenName} earned and available to be claimed`
                }
              >
                <InlineImage
                  src={rewardTokenImageUrl}
                  alt={`${rewardTokenName} logo`}
                  boxSize={5}
                />
                <Text textAlign="center">
                  {isMounted &&
                    (cellarConfig.customReward?.customRewardMessage ??
                      (isConnected
                        ? userStakes?.totalClaimAllRewards
                            .formatted || "..."
                        : "--"))}
                </Text>
              </CardStat>
            </a>
            <br />
          </HStack>
        ) : null}
        {cellarConfig.customReward?.showSommRewards ||
        cellarConfig.customReward?.showSommRewards === undefined ? (
          <>
            <HStack>
              <CardStat
                label={"SOMM Rewards"}
                tooltip={`Amount of SOMM earned and available to be claimed`}
              >
                <InlineImage
                  src={sommToken.src}
                  alt={`SOMM logo`}
                  boxSize={5}
                />
                <Text textAlign="center">
                  {isMounted &&
                    (isConnected
                      ? userStakes?.totalClaimAllRewards.formatted ||
                        "..."
                      : "--")}
                </Text>
              </CardStat>
            </HStack>
          </>
        ) : null}
      </VStack>
      {cellarConfig?.customReward?.showClaim !== false ? (
        <BaseButton
          disabled={claimAllDisabled}
          onClick={handleClaimAll}
        >
          {cellarConfig?.customReward?.customClaimMsg ?? `Claim All`}
        </BaseButton>
      ) : null}
    </SimpleGrid>
  )
}
