import {
  Box,
  BoxProps,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { VFC } from "react"
import { DepositButton } from "components/_buttons/DepositButton"
import { BondButton } from "components/_buttons/BondButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import { tokenConfig } from "data/tokenConfig"
import { InlineImage } from "components/InlineImage"
import { TransparentCard } from "./TransparentCard"
import { TokenAssets } from "components/TokenAssets"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { useAaveStaker } from "context/aaveStakerContext"
import { formatUSD, toEther } from "utils/formatCurrency"
import { ethers } from "ethers"
import { BaseButton } from "components/_buttons/BaseButton"
import { useHandleTransaction } from "hooks/web3"
import BondingTableCard from "./BondingTableCard"
import { Apy } from "components/Apy"
import BigNumber from "bignumber.js"
import { analytics } from "utils/analytics"
import { debounce } from "lodash"
import { useGetPositionQuery } from "generated/subgraph"
import { useAccount } from "wagmi"
import { getPNL } from "utils/pnl"

interface PortfolioCardProps extends BoxProps {
  isConnected?: boolean
  cellarShareBalance?: BigNumber
}

export const PortfolioCard: VFC<PortfolioCardProps> = ({
  isConnected,
  cellarShareBalance,
  ...rest
}) => {
  const { userData, cellarData } = useAaveV2Cellar()
  const { aaveStakerSigner, fetchUserStakes, userStakeData } =
    useAaveStaker()
  const { doHandleTransaction } = useHandleTransaction()
  const { userStakes, totalBondedAmount, claimAllRewardsUSD } =
    userStakeData
  const userRewards =
    userStakeData?.totalClaimAllRewards &&
    new BigNumber(userStakeData?.totalClaimAllRewards).toString()
  const claimAllDisabled =
    !isConnected || !userRewards || parseInt(userRewards) <= 0

  const lpTokenDisabled =
    !isConnected ||
    parseInt(toEther(userData?.balances?.aaveClr, 18)) <= 0

  const handleClaimAll = async () => {
    const tx = await aaveStakerSigner.claimAll()
    await doHandleTransaction(tx)
    fetchUserStakes()
  }

  const { activeAsset } = cellarData

  // PNL
  const [{ data: account }] = useAccount()
  const [{ data: positionData }] = useGetPositionQuery({
    variables: {
      walletAddress: (account?.address ?? "").toLowerCase(),
    },
    pause: false,
  })

  const userTvl = new BigNumber(cellarShareBalance?.toString() ?? 0)

  const currentUserDeposits = new BigNumber(
    positionData?.wallet?.currentDeposits ?? 0
  )
  // always 18 decimals from subgraph, must be normalized to 6
  const deposits = currentUserDeposits.div(
    new BigNumber(10).pow(18 - 6)
  )

  const pnl = getPNL(userTvl, deposits)

  // netValue = cellarValue + rewardValue
  let netValue = new BigNumber(
    toEther(
      cellarShareBalance?.toString(),
      userData?.balances?.aAsset?.decimals,
      false,
      2
    )
  )
  if (claimAllRewardsUSD) {
    netValue = netValue.plus(claimAllRewardsUSD)
  }

  const formattedNetValue = netValue.toFixed(2, 0)

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
              {isConnected ? formatUSD(formattedNetValue) : "--"}
            </CardStat>
            <CardStat
              label="deposit assets"
              tooltip="Accepted deposit assets"
              alignSelf="flex-start"
              spacing={0}
            >
              <TokenAssets
                tokens={tokenConfig}
                activeAsset={activeAsset}
                displaySymbol
              />
            </CardStat>
            <Box
              onMouseEnter={debounce(() => {
                analytics.track("cellar.tooltip-opened-apy")
              }, 1000)}
            >
              <CardStat
                label="pnl"
                tooltip={`${pnl.toFixed(
                  5,
                  0
                )}%: This represents percentage gains compared to current deposits`}
                labelProps={{
                  textTransform: "uppercase",
                }}
              >
                {isConnected ? <Apy apy={pnl.toFixed(2, 1)} /> : "--"}
              </CardStat>
            </Box>
            <Stack
              spacing={3}
              direction={{ sm: "row", md: "column", lg: "row" }}
            >
              <DepositButton disabled={!isConnected} />
              <WithdrawButton disabled={lpTokenDisabled} />
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
                {isConnected
                  ? toEther(userData?.balances?.aaveClr, 18, false, 2)
                  : "--"}
              </CardStat>
            </VStack>
            <VStack align="flex-start">
              <CardStat
                label="bonded tokens"
                tooltip="Bonded LP tokens earn yield from strategy and accrue Liquidity Mining rewards based on bonding period length"
              >
                {isConnected
                  ? toEther(
                      ethers.utils.parseUnits(
                        totalBondedAmount?.toFixed() || "0",
                        0
                      ),
                      18,
                      false,
                      2
                    )
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
                  alt="aave logo"
                  boxSize={5}
                />
                {isConnected
                  ? toEther(
                      userStakeData?.totalClaimAllRewards?.toFixed() ||
                        "0",
                      6,
                      false,
                      2
                    )
                  : "--"}
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
        {isConnected && userStakes.length && <BondingTableCard />}
      </VStack>
    </TransparentCard>
  )
}
