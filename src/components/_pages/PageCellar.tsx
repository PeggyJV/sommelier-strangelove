import { FC, useMemo } from "react"
import {
  Heading,
  HeadingProps,
  HStack,
  VStack,
} from "@chakra-ui/react"
import { Layout } from "components/_layout/Layout"
import { Section } from "components/_layout/Section"
import CellarDetailsCard from "components/_cards/CellarDetailsCard"
import { CellarStatsYield } from "components/CellarStatsYield"
import { BreadCrumb } from "components/BreadCrumb"
import { cellarDataMap } from "data/cellarDataMap"
import { PortfolioCard } from "components/_cards/PortfolioCard"
import { CellarStatsAutomated } from "components/CellarStatsAutomated"
import { CellarNameKey, CellarType } from "data/types"
import {
  isApyChartEnabled,
  isEstimatedApyEnable,
  isTokenPriceChartEnabled,
} from "data/uiConfig"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { TokenPriceChartProvider } from "data/context/tokenPriceChartContext"
import { TokenPricePerfomanceCard } from "components/_cards/TokenPricePerfomaceCard"
import { ApyChartProvider } from "data/context/apyChartContext"
import { ApyPerfomanceCard } from "components/_cards/ApyPerfomanceCard"
import { isComingSoon } from "utils/isComingSoon"
import { InfoBanner } from "components/_banners/InfoBanner"
import { WalletHealthBanner } from "components/_banners/WalletHealthBanner"
import dynamic from "next/dynamic"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUserBalance } from "data/hooks/useUserBalance"
import { config as utilConfig } from "utils/config"
import { Box, Button } from "@chakra-ui/react"
import ConnectGate from "components/wallet/ConnectGate"

import { useAccount } from "wagmi"

const h2Styles: HeadingProps = {
  as: "h2",
  fontSize: "2xl",
  color: "neutral.300",
  pl: { base: 6, sm: 8 },
}

export interface PageCellarProps {
  id: string
}

const PageCellar: FC<PageCellarProps> = ({ id }) => {
  const cellarConfig = cellarDataMap[id].config
  const isAlphaSteth = id === utilConfig.CONTRACT.ALPHA_STETH.SLUG
  const isRealYieldEth =
    id === utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG
  const isTurboSteth = id === utilConfig.CONTRACT.TURBO_STETH.SLUG
  const { isOpen, onClose, type, setIsOpen } = useDepositModalStore()
  const { isConnected } = useAccount()
  const router = useRouter()
  const DynamicMigrationModal = useMemo(
    () =>
      dynamic(
        () =>
          import("components/_modals/MigrationModal").then((m) => ({
            default: m.MigrationModal,
          })),
        { ssr: false, loading: () => null }
      ),
    []
  )

  // Deep-link: ?action=deposit → open deposit modal (after wallet/network checks on page)
  useEffect(() => {
    const action = router.query?.action
    if (action === "deposit") {
      // Open the deposit modal for this vault
      setIsOpen({ id, type: "deposit" })
    }
  }, [router.query?.action, id, setIsOpen, router])

  // Check if user should see migration prompt for Real Yield ETH or Turbo stETH

  // Check if Alpha stETH vault has available capacity (not at max TVL)
  const showMigrationForSourceVault = useMemo(() => {
    if (!isRealYieldEth && !isTurboSteth) return false
    // You could add additional checks here for Alpha stETH capacity if needed
    return true
  }, [isRealYieldEth, isTurboSteth])
  const staticCellarData = cellarDataMap[id]
  const cellarAddress = cellarDataMap[id].config.id
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  const isYieldStrategies =
    staticCellarData.cellarType === CellarType.yieldStrategies
  const isAutomatedPortfolio =
    staticCellarData.cellarType === CellarType.automatedPortfolio
  const notLaunched = isComingSoon(cellarDataMap[id].launchDate)

  return (
    <Layout chainObj={cellarConfig.chain}>
      <WalletHealthBanner />
      {cellarConfig.cellarNameKey === CellarNameKey.TURBO_EETH && (
        <InfoBanner
          text={
            <>
              Turbo eETH V1 (current vault) is migrating to{" "}
              <a
                href="https://app.sommelier.finance/Turbo-eETHV2/manage"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                Turbo eETH V2
              </a>{" "}
              (new vault).
              <div>
                Your capital in V1 is already earning the native yield
                from{" "}
                <a
                  href="https://app.sommelier.finance/Turbo-eETHV2/manage"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  Turbo eETH V2
                </a>
                , but new staking programs with SOMM incentives will
                use the V2 share token.
              </div>
              <div>
                To participate in any new rewards program, you must
                withdraw your assets from Turbo eETH V1 and deposit
                into{" "}
                <a
                  href="https://app.sommelier.finance/Turbo-eETHV2/manage"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  Turbo eETH V2
                </a>
                .
              </div>
            </>
          }
        />
      )}
      <Section>
        {/* Desktop header */}
        <HStack
          display={{ base: "none", md: "flex" }}
          pb={12}
          justify="space-between"
          align="flex-end"
          wrap="wrap"
          rowGap={4}
        >
          <VStack spacing={6} align="flex-start">
            <BreadCrumb cellarName={staticCellarData.name} id={id} />
            <HStack spacing={4}>
              <Heading fontSize="2.5rem">
                {staticCellarData.name}{" "}
              </Heading>
            </HStack>
          </VStack>
          <HStack spacing={3} align="flex-end">
            {isYieldStrategies && (
              <CellarStatsYield
                cellarId={id}
                alphaStethOverrides={
                  id === utilConfig.CONTRACT.ALPHA_STETH.SLUG
                }
              />
            )}
            {isAutomatedPortfolio && (
              <CellarStatsAutomated cellarConfig={cellarConfig} />
            )}
          </HStack>
        </HStack>

        {/* Mobile compact header */}
        <VStack spacing={3} align="stretch" display={{ base: "flex", md: "none" }} px={6} pt={4}>
          <BreadCrumb cellarName={staticCellarData.name} id={id} />
          <HStack justify="space-between" align="center">
            <Heading fontSize="xl" noOfLines={1}>
              {staticCellarData.name}
            </Heading>
            <HStack spacing={2} px={2} py={1} rounded="full" bg="whiteAlpha.100">
              <Image
                src={cellarConfig.chain.logoPath}
                alt={cellarConfig.chain.alt}
                boxSize={4}
                background={"transparent"}
              />
              <Text fontSize="xs" color="whiteAlpha.800">{cellarConfig.chain.displayName}</Text>
            </HStack>
          </HStack>
          {isYieldStrategies && (
            <CellarStatsYield
              cellarId={id}
              alphaStethOverrides={id === utilConfig.CONTRACT.ALPHA_STETH.SLUG}
              px={0}
            />
          )}
          {isAutomatedPortfolio && (
            <CellarStatsAutomated cellarConfig={cellarConfig} />
          )}
        </VStack>

        <VStack spacing={4} align="stretch">
          <Heading {...h2Styles} pt={12}>
            Your Portfolio
          </Heading>
          {type === "migrate" &&
            (isAlphaSteth || showMigrationForSourceVault) &&
            id && (
              <DynamicMigrationModal
                isOpen={isOpen}
                onClose={onClose}
              />
            )}
          <PortfolioCard />
        </VStack>
      </Section>

      {/* Sticky mobile action bar */}
      <Box
        display={{ base: isOpen ? "none" : "block", md: "none" }}
        position="sticky"
        bottom={0}
        zIndex={10}
        bg="surface.primary"
        borderTop="1px solid"
        borderColor="surface.secondary"
        px={4}
        py={3}
      >
        <ConnectGate
          fallbackLabel="Connect wallet to deposit"
          fullWidth
          overrideChainId={cellarConfig.chain.id}
        >
          <Button
            width="100%"
            height="48px"
            variant="solid"
            colorScheme="purple"
            onClick={() => setIsOpen({ id, type: "deposit" })}
          >
            Deposit
          </Button>
        </ConnectGate>
      </Box>
      <Section px={{ base: 0, md: 4 }}>
        <VStack spacing={6} align="stretch">
          {!notLaunched &&
            isApyChartEnabled(cellarConfig) &&
            !isEstimatedApyEnable(cellarConfig) && (
              <ApyChartProvider
                address={cellarAddress}
                chain={cellarConfig.chain.id}
              >
                <Heading pt={isLarger768 ? 12 : 0} {...h2Styles}>
                  Vault Perfomance
                </Heading>
                <ApyPerfomanceCard />
              </ApyChartProvider>
            )}
          {isTokenPriceChartEnabled(cellarConfig) && (
            <TokenPriceChartProvider
              address={cellarAddress}
              chain={cellarConfig.chain.id}
            >
              <Heading pt={isLarger768 ? 12 : 0} {...h2Styles}>
                Vault Perfomance
              </Heading>
              <TokenPricePerfomanceCard />
            </TokenPriceChartProvider>
          )}

          <Heading pt={isYieldStrategies ? 0 : 12} {...h2Styles}>
            Vault Details
          </Heading>
          <CellarDetailsCard
            cellarDataMap={cellarDataMap}
            cellarId={id}
          />
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar
