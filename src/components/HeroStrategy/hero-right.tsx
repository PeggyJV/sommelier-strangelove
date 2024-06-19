import {
  Box,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { BuyOrSellModal } from "components/_modals/BuyOrSellModal"
import { cellarDataMap } from "data/cellarDataMap"
import { tokenConfig } from "data/tokenConfig"
import { isComingSoon } from "utils/isComingSoon"
import { CountDown } from "./count-down"
import { addDays } from "date-fns"
import { Link } from "components/Link"
import { useRouter } from "next/router"
import { CellarType } from "data/types"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useStrategyData } from "data/hooks/useStrategyData"

interface HeroStrategyRightProps {
  id: string
}

export const HeroStrategyRight = ({
  id,
}: HeroStrategyRightProps) => {
  const content = strategyPageContentData[id]
  const buyOrSellModal = useDisclosure()
  const notifyModal = useDisclosure()
  const cellarData = cellarDataMap[id]
  const launchDate = cellarDataMap[id].launchDate
  const twoDaysAfterLaunch = addDays(
    launchDate ?? new Date(Date.now()),
    2
  )
  const cellarConfig = cellarData.config
  const { data, isLoading } = useStrategyData(
    cellarData.config.cellar.address,
    cellarData.config.chain.id
  )
  const {
    tokenPrice,
    changes,
    stakingEnd,
    tvm,
    rewardsApy,
    baseApy,
    baseApySumRewards,
  } = data || {}
  const dailyChange = changes?.daily
  const router = useRouter()

  const countdown = isComingSoon(launchDate)

  const potentialStakingApy = isLoading
    ? "-"
    : rewardsApy?.formatted || "-"

  const handleBuyOrSell = () => {
    if (Number(content.exchange?.length) > 1) {
      // analytics.track("strategy.buy-sell", {
      //   strategyCard: cellarData.name,
      //   landingType: landingType(),
      // })
      buyOrSellModal.onOpen()
    } else {
      // analytics.track("strategy.buy-sell", {
      //   strategyCard: cellarData.name,
      //   landingType: landingType(),
      // })
      router.push({
        pathname: `/strategies/${id}/manage`,
      })
    }
  }

  const isYieldStrategies =
    cellarData.cellarType === CellarType.yieldStrategies
  const isAutomatedPortfolio =
    cellarData.cellarType === CellarType.automatedPortfolio

  return (
    <Stack minW={{ base: "100%", md: "380px" }} spacing={4}>
      {countdown && launchDate ? (
        <>
          <CountDown launchDate={launchDate} />
          {/* <BaseButton
        w="full"
        h="60px"
        onClick={() => {
          // analytics.track("strategy.notify-me", {
          //   strategyCard: cellarData.name,
          //   landingType: landingType(),
          // })
          notifyModal.onOpen()
        }}
      >
        Notify me
      </BaseButton>
      <NotifyModal
        isOpen={notifyModal.isOpen}
        onClose={notifyModal.onClose}
      /> */}
        </>
      ) : (
        <>
          <BaseButton w="full" h="50px" onClick={handleBuyOrSell}>
            {data?.deprecated ? "Withdraw" : "Deposit / Withdraw"}
          </BaseButton>
          <BuyOrSellModal
            exchange={content.exchange}
            id={id}
            isOpen={buyOrSellModal.isOpen}
            onClose={buyOrSellModal.onClose}
          />
          <Link
            href={`/strategies/${id}/manage`}
            onClick={() => {
              // analytics.track("strategy.manage-portfolio", {
              //   strategyCard: cellarData.name,
              //   landingType: landingType(),
              // })
            }}
            textDecoration="none"
          >
            <SecondaryButton w="full" h="50px">
              View Details
            </SecondaryButton>
          </Link>
        </>
      )}

      <Stack pt={4} spacing={6} color="neutral.300">
        <HStack>
          <Box>
            <Text w="150px" fontWeight="semibold">
              Ticker
            </Text>
          </Box>
          {content.ticker}
        </HStack>
        <HStack>
          <Box>
            <Text w="150px" fontWeight="semibold">
              Chain
            </Text>
          </Box>
          <Image
            src={cellarConfig.chain.logoPath}
            alt={cellarConfig.chain.alt}
            background={"transparent"}
            boxSize={8}
          />{" "}
          <Text>{cellarConfig.chain.displayName}</Text>
        </HStack>
        <HStack alignItems="start">
          <Box>
            <Text w="150px" fontWeight="semibold">
              Traded Assets
            </Text>
          </Box>
          <Stack direction="column">
            {isLoading ? (
              <Spinner />
            ) : (
              content.tradedAssets?.map((item) => {
                const asset = tokenConfig.find(
                  (v) =>
                    v.symbol === item &&
                    v.chain === cellarConfig.chain.id
                )
                return (
                  <HStack key={item}>
                    <Image
                      alt={asset?.alt}
                      src={asset?.src}
                      boxSize={8}
                      rounded="full"
                    />
                    <Text>{asset?.symbol}</Text>
                  </HStack>
                )
              })
            )}
          </Stack>
        </HStack>
        {/* <HStack>
          <Box>
            <Text w="150px" fontWeight="semibold">
              Alternative to
            </Text>
          </Box>
          <Text>{content.alternativeTo}</Text>
        </HStack> */}
      </Stack>
    </Stack>
  )
}
