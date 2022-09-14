import { BoxProps, SimpleGrid, Stack, VStack } from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { VFC } from "react"
import { BondButton } from "components/_buttons/BondButton"
import { InlineImage } from "components/InlineImage"
import { TransparentCard } from "./TransparentCard"
import { toEther } from "utils/formatCurrency"
import { BaseButton } from "components/_buttons/BaseButton"
import { useHandleTransaction } from "hooks/web3"
import BondingTableCard from "./BondingTableCard"
import { useConnect } from "wagmi"
import { tokenConfig } from "data/tokenConfig"
import { TokenAssets } from "components/TokenAssets"
import { DepositButton } from "components/_buttons/DepositButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { analytics } from "utils/analytics"
import { ImportMetamaskButton } from "components/_buttons/ImportMetamaskButton"
import { useRouter } from "next/router"
import { useOutputUserData } from "src/composite-data/hooks/output/useOutputUserData"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalances } from "src/composite-data/hooks/output/useUserBalances"
import { useCreateContracts } from "src/composite-data/hooks/output/useCreateContracts"

interface PortfolioCardProps extends BoxProps {
  isConnected?: boolean
}

export const PortfolioCard: VFC<PortfolioCardProps> = ({
  isConnected,
  ...rest
}) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const [auth] = useConnect()
  const { stakerSigner } = useCreateContracts(cellarConfig)

  const outputUserData = useOutputUserData(cellarConfig)
  const { lpToken } = useUserBalances(cellarConfig)
  const [{ data: lpTokenData }] = lpToken

  const lpTokenDisabled =
    !isConnected || parseInt(toEther(lpTokenData?.formatted, 18)) <= 0

  const userRewards =
    outputUserData.data.totalClaimAllRewards?.value.toString()

  const claimAllDisabled =
    !isConnected || !userRewards || parseInt(userRewards) <= 0

  const { doHandleTransaction } = useHandleTransaction()

  const handleClaimAll = async () => {
    analytics.track("rewards.claim-started")
    const tx = await stakerSigner.claimAll()
    await doHandleTransaction({
      ...tx,
      onSuccess: () => analytics.track("rewards.claim-succeeded"),
      onError: () => analytics.track("rewards.claim-failed"),
    })
    outputUserData.refetch()
  }

  return (
    <TransparentCard p={8} {...rest}>
      <VStack align="stretch" spacing={8}>
        <CardStatRow
          // px={{ md: 10 }}
          spacing={{ sm: 4, md: 8, lg: 14 }}
          align="flex-start"
          justify="flex-start"
          direction={{ sm: "column", md: "row" }}
          wrap="wrap"
        >
          <SimpleGrid
            templateColumns={{
              sm: "max-content",
              lg: "repeat(2, max-content)",
            }}
            templateRows="1fr 1fr"
            spacing={4}
            alignItems="flex-end"
          >
            <CardStat
              label="net value"
              tooltip="Current value of your assets in Cellar"
            >
              {isConnected
                ? outputUserData.data.netValue?.formatted || "..."
                : "--"}
            </CardStat>

            <CardStat
              label="deposit assets"
              tooltip="Accepted deposit assets"
              alignSelf="flex-start"
              spacing={0}
            >
              <TokenAssets
                tokens={tokenConfig}
                activeAsset={
                  outputUserData.data.activeAsset?.address || ""
                }
                displaySymbol
              />
            </CardStat>
            {/* TODO: Verify PNL result */}
            {/* <CardStat
              label="pnl"
              tooltip={`${
                ((outputUserData.data.pnl &&
                  outputUserData.data.pnl.value.toFixed(5, 0)) ||
                  "...") + "%"
              }: This represents percentage gains compared to current deposits`}
              labelProps={{
                textTransform: "uppercase",
              }}
            >
              {isConnected ? (
                <Apy
                  apy={
                    (outputUserData.data.pnl &&
                      `${outputUserData.data.pnl.formatted}`) ||
                    "..."
                  }
                />
              ) : (
                "--"
              )}
            </CardStat> */}
            <Stack
              spacing={3}
              direction={{ sm: "row", md: "column", lg: "row" }}
            >
              {isConnected ? (
                <>
                  <DepositButton disabled={!isConnected} />
                  <WithdrawButton disabled={lpTokenDisabled} />
                </>
              ) : (
                auth.data.connectors.map((c) => (
                  <ConnectButton connector={c} key={c.id} unstyled />
                ))
              )}
            </Stack>
          </SimpleGrid>
          <SimpleGrid
            templateColumns={{
              sm: "max-content",
              md: "repeat(2, max-content)",
            }}
            templateRows="repeat(2, 1fr)"
            spacing={4}
            alignItems="flex-end"
          >
            <VStack align="flex-start">
              <CardStat
                label="tokens"
                tooltip="Unbonded LP tokens earn interest from strategy but do not earn Liquidity Mining rewards"
              >
                {isConnected ? (
                  <>
                    {(lpTokenData &&
                      toEther(lpTokenData.formatted, 18, false, 2)) ||
                      "..."}
                    <ImportMetamaskButton
                      address={cellarConfig.lpToken.address}
                    />
                  </>
                ) : (
                  "--"
                )}
              </CardStat>
            </VStack>
            <VStack align="flex-start">
              <CardStat
                label="bonded tokens"
                tooltip="Bonded LP tokens earn yield from strategy and accrue Liquidity Mining rewards based on bonding period length"
              >
                {isConnected
                  ? outputUserData.data.totalBondedAmount
                      ?.formatted || "..."
                  : "--"}
              </CardStat>
            </VStack>
            <BondButton disabled={lpTokenDisabled} />
          </SimpleGrid>
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
                {isConnected ? (
                  <>
                    {outputUserData.data.totalClaimAllRewards
                      ?.formatted || "..."}
                    <ImportMetamaskButton
                      address={cellarConfig.rewardTokenAddress}
                    />
                  </>
                ) : (
                  "--"
                )}
              </CardStat>
            </VStack>
            <BaseButton
              disabled={claimAllDisabled}
              onClick={handleClaimAll}
            >
              Claim All
            </BaseButton>
          </SimpleGrid>
        </CardStatRow>
        {isConnected &&
          outputUserData.data.userStake?.userStakes.length && (
            <BondingTableCard />
          )}
      </VStack>
    </TransparentCard>
  )
}
