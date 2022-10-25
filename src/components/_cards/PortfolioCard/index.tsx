import { BoxProps, SimpleGrid, Stack, VStack } from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { VFC } from "react"
import { BondButton } from "components/_buttons/BondButton"
import { TransparentCard } from "../TransparentCard"
import { toEther } from "utils/formatCurrency"
import BondingTableCard from "../BondingTableCard"
import { useAccount, useConnect } from "wagmi"
import { depositAssetTokenConfig } from "data/tokenConfig"
import { TokenAssets } from "components/TokenAssets"
import { DepositButton } from "components/_buttons/DepositButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useUserStakes } from "data/hooks/useUserStakes"
import { useNetValue } from "data/hooks/useNetValue"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { useUserBalances } from "data/hooks/useUserBalances"
import { Rewards } from "./Rewards"
import {
  isBondingEnabled,
  isRewardsEnabled,
  lpTokenTooltipContent,
} from "data/uiConfig"

export const PortfolioCard: VFC<BoxProps> = (props) => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { connectors } = useConnect()

  const { lpToken } = useUserBalances(cellarConfig)
  const { data: lpTokenData } = lpToken

  const lpTokenDisabled =
    !lpTokenData ||
    Number(toEther(lpTokenData?.formatted, lpTokenData?.decimals)) <=
      0

  const { data: userStakes } = useUserStakes(cellarConfig)

  const { data: netValue } = useNetValue(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)

  return (
    <TransparentCard p={8} {...props}>
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
              {isMounted &&
                (isConnected ? netValue?.formatted || "..." : "--")}
            </CardStat>

            <CardStat
              label="deposit assets"
              tooltip="Accepted deposit assets"
              alignSelf="flex-start"
              spacing={0}
            >
              <TokenAssets
                tokens={depositAssetTokenConfig}
                activeAsset={activeAsset?.address || ""}
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
              {isMounted &&
                (isConnected ? (
                  <>
                    <DepositButton disabled={!isConnected} />
                    <WithdrawButton disabled={lpTokenDisabled} />
                  </>
                ) : (
                  connectors.map((c) => (
                    <ConnectButton
                      connector={c}
                      key={c.id}
                      unstyled
                    />
                  ))
                ))}
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
                tooltip={lpTokenTooltipContent(cellarConfig)}
              >
                {isMounted &&
                  (isConnected
                    ? (lpTokenData &&
                        toEther(
                          lpTokenData.formatted,
                          18,
                          false,
                          2
                        )) ||
                      "..."
                    : "--")}
              </CardStat>
            </VStack>
            {isBondingEnabled(cellarConfig) && (
              <>
                <VStack align="flex-start">
                  <CardStat
                    label="bonded tokens"
                    tooltip="Bonded LP tokens earn yield from strategy and accrue Liquidity Mining rewards based on bonding period length"
                  >
                    {isMounted &&
                      (isConnected
                        ? userStakes?.totalBondedAmount.formatted ||
                          "..."
                        : "--")}
                  </CardStat>
                </VStack>
                {isMounted && (
                  <BondButton disabled={lpTokenDisabled} />
                )}
              </>
            )}
          </SimpleGrid>
          {isRewardsEnabled(cellarConfig) && (
            <Rewards cellarConfig={cellarConfig} />
          )}
        </CardStatRow>
        {isBondingEnabled(cellarConfig) &&
          isConnected &&
          userStakes?.userStakes.length && <BondingTableCard />}
      </VStack>
    </TransparentCard>
  )
}
