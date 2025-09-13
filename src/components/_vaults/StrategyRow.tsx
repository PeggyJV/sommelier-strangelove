import {
  Badge,
  Box,
  Grid,
  HStack,
  Text,
  VStack,
  Image,
  Button,
  Avatar,
  Stack,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import ConnectGate from "components/wallet/ConnectGate"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useStrategyData } from "data/hooks/useStrategyData"
import KPIBox from "components/_vaults/KPIBox"
import { AlphaApyTooltip } from "components/alpha/AlphaApyTooltip"
import ActionButton from "components/ui/ActionButton"
import { config as utilConfig } from "utils/config"
import { formatAlphaStethNetApyNoApprox } from "utils/alphaStethFormat"

type Vault = {
  name?: string
  isSommNative?: boolean
  provider?: { title?: string } | string
  builtWith?: string[]
  description?: string
  launchDate?: string | number | Date
  tvm?: { formatted?: string }
  baseApySumRewards?: { value?: number | string; formatted?: string }
  config?: {
    chain?: { displayName?: string; id?: string }
    cellar?: { address?: string }
  }
  slug?: string
}

export default function StrategyRow({ vault }: { vault: Vault }) {
  const { setIsOpen } = useDepositModalStore()
  const providerText =
    (vault?.provider as any)?.title ||
    (vault?.provider as string) ||
    ""
  const built = Array.isArray(vault?.builtWith)
    ? vault?.builtWith
    : []
  // Prefer list TVL; fallback to individual strategy data if missing
  const netVal =
    typeof vault?.baseApySumRewards?.value === "string"
      ? parseFloat(vault?.baseApySumRewards?.value)
      : (vault?.baseApySumRewards?.value as number | undefined)
  const netFmt = vault?.baseApySumRewards?.formatted
  const isAlpha = vault?.slug === utilConfig.CONTRACT.ALPHA_STETH.SLUG
  const approxNetFmt = (() => {
    const raw = netFmt
    if (!raw) return undefined
    return formatAlphaStethNetApyNoApprox(raw)
  })()
  const chainLabel = vault?.config?.chain?.displayName ?? "—"
  const chainLogo = (vault as any)?.config?.chain?.logoPath
  const launchDate = vault?.launchDate
    ? new Date(vault.launchDate)
    : undefined

  const isPreLaunch = useMemo(() => {
    return !!launchDate && Date.now() < launchDate.getTime()
  }, [launchDate?.getTime?.()])

  // User net value (reuse manage page logic via hook)
  const strategyAddress = vault?.config?.cellar?.address
  const strategyChainId = vault?.config?.chain?.id
  const { data: stratData } =
    strategyAddress && strategyChainId
      ? useStrategyData(strategyAddress, strategyChainId)
      : ({} as any)
  const tvl = stratData?.tvm?.formatted ?? vault?.tvm?.formatted
  const { data: userStratData } =
    strategyAddress && strategyChainId
      ? useUserStrategyData(
          strategyAddress,
          strategyChainId,
          // Gate by connection status implicitly via hook (enabled flag)
          true
        )
      : ({} as any)
  const netValueFmt: string | undefined = (userStratData as any)
    ?.userStrategyData?.userData?.netValue?.formatted

  const safeValue = (v?: string | number | null) =>
    v === undefined || v === null || v === "" ? "–" : v

  // Helper text countdown (compact). Updates every second, rendered once below button
  const [remaining, setRemaining] = useState<string>("")
  useEffect(() => {
    if (!launchDate) return
    const tick = () => {
      const ms = launchDate.getTime() - Date.now()
      if (ms <= 0) {
        setRemaining("")
        return
      }
      const days = Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)))
      const hours = Math.max(
        0,
        Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      )
      const minutes = Math.max(
        0,
        Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
      )
      setRemaining(`${days}d ${hours}h ${minutes}m`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [launchDate?.getTime?.()])

  const oneLineDesc = vault?.description?.length
    ? vault.description
    : "Dynamically reallocates stETH across Aave, Morpho, Unichain, and Mellow."

  return (
    <Box
      // Ensure mobile rows have enough vertical space for the CTA
      // and that content never overflows the card boundary
      sx={{
        "@media (max-width: 768px)": {
          paddingBottom: "8px",
        },
      }}
    >
      <Grid
        templateColumns={{ base: "1fr", md: "1.2fr 1.1fr 1fr" }}
        gap={{ base: 3, md: 6 }}
        alignItems="center"
        // Prevent button clipping due to hidden overflow on grid/td parents
        overflow="visible"
      >
        {/* Left column: Identity */}
        <HStack spacing={{ base: 2, md: 3 }} align="center" minW={0}>
          <Image
            src={
              vault?.isSommNative
                ? "/assets/icons/alpha-steth.png"
                : (vault as any)?.logo
            }
            alt={vault?.name || "Vault"}
            boxSize={{ base: "32px", md: "40px" }}
            rounded="full"
            flexShrink={0}
          />
          <VStack spacing={1} align="flex-start" minW={0} flex={1}>
            <HStack spacing={2} flexWrap="wrap" minW={0}>
              <Text
                fontSize={{ base: "md", md: "xl" }}
                fontWeight={800}
                noOfLines={1}
              >
                {vault?.name}
              </Text>
            </HStack>
            <HStack spacing={2} flexWrap="wrap">
              {vault?.isSommNative && (
                <Badge
                  colorScheme="blue"
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  Somm-native
                </Badge>
              )}
              {chainLogo && (
                <HStack
                  spacing={1}
                  px={2}
                  py={0.5}
                  rounded="full"
                  bg="whiteAlpha.100"
                >
                  <Avatar
                    name={chainLabel}
                    src={chainLogo}
                    background="transparent"
                    border="none"
                    sx={{ width: "16px", height: "16px" }}
                  />
                  <Text fontSize="xs" color="whiteAlpha.800">
                    {chainLabel}
                  </Text>
                </HStack>
              )}
            </HStack>
            {providerText && (
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="whiteAlpha.800"
                noOfLines={1}
              >
                {providerText}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* Center column: KPIs in equal widths */}
        <Grid
          templateColumns={{
            base: "repeat(3, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={{ base: 2, md: 4 }}
          alignItems="center"
        >
          <KPIBox label="TVL" value={safeValue(tvl)} align="left" />
          <KPIBox
            label="Net Value"
            value={safeValue(netValueFmt)}
            align="center"
          />
          <Box position="relative">
            <KPIBox
              label={isAlpha ? "Net APY" : "Net Rewards"}
              value={safeValue(
                isAlpha ? approxNetFmt ?? netFmt : netFmt
              )}
              align="right"
            />
            {isAlpha && (
              <Box position="absolute" top={0} right={0} transform="translateY(-50%)">
                <AlphaApyTooltip />
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right column: chain + primary action with single helper */}
        <VStack
          spacing={2}
          align={{ base: "stretch", md: "end" }}
          // Reserve vertical space on mobile so the button never gets clipped
          sx={{
            "@media (max-width: 768px)": {
              minHeight: "56px",
            },
          }}
          w="100%"
          minW={0}
        >
          <Box px={{ base: 3, md: 0 }} w="100%">
            <ConnectGate
              fallbackLabel="Connect wallet to deposit"
              fullWidth
              overrideChainId={(vault as any)?.config?.chain?.id}
            >
              {isPreLaunch ? (
                <ActionButton
                  variantStyle="primary"
                  size={{ base: "md", md: "md" }}
                  fullWidth
                  isDisabled
                  onClick={(e) => e.stopPropagation()}
                >
                  Deposit
                </ActionButton>
              ) : (
                <ActionButton
                  variantStyle="primary"
                  size={{ base: "md", md: "md" }}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!vault?.slug) return
                    setIsOpen({ id: vault.slug, type: "deposit" })
                  }}
                >
                  Deposit
                </ActionButton>
              )}
            </ConnectGate>
          </Box>
          {isPreLaunch && remaining && (
            <Text fontSize="xs" color="neutral.400">
              Available in: {remaining}
            </Text>
          )}
        </VStack>
      </Grid>

      {/* One-line description */}
      {oneLineDesc && (
        <Text
          mt={{ base: 2, md: 3 }}
          fontSize={{ base: "xs", md: "sm" }}
          color="neutral.300"
          noOfLines={1}
        >
          {oneLineDesc}
        </Text>
      )}
    </Box>
  )
}
