import {
  Box,
  Grid,
  HStack,
  Text,
  VStack,
  Image,
  Avatar,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import ConnectGate from "components/wallet/ConnectGate"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useStrategyData } from "data/hooks/useStrategyData"
import KPIBox from "components/_vaults/KPIBox"
import ActionButton from "components/ui/ActionButton"
import { config as utilConfig } from "utils/config"
import { formatAlphaStethNetApyNoApprox } from "utils/alphaStethFormat"
import { AlphaApyPopover } from "components/alpha/AlphaApyPopover"

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

  // User net value
  const strategyAddress = vault?.config?.cellar?.address
  const strategyChainId = vault?.config?.chain?.id
  const { data: stratData } =
    strategyAddress && strategyChainId
      ? useStrategyData(strategyAddress, strategyChainId)
      : ({} as any)
  const tvl = stratData?.tvm?.formatted ?? vault?.tvm?.formatted
  const { data: userStratData } =
    strategyAddress && strategyChainId
      ? useUserStrategyData(strategyAddress, strategyChainId, true)
      : ({} as any)
  const netValueFmt: string | undefined = (userStratData as any)
    ?.userStrategyData?.userData?.netValue?.formatted

  const safeValue = (v?: string | number | null) =>
    v === undefined || v === null || v === "" ? "–" : v

  // Countdown
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
      borderWidth="1px"
      borderColor="border.subtle"
      bg="brand.surface"
      rounded="lg"
      p={{ base: 4, md: 6 }}
      w="full"
      _hover={{
        borderColor: "brand.primary",
        bg: "rgba(26, 29, 37, 0.8)",
      }}
      transition="border-color .15s ease, background .15s ease"
      sx={{
        "@media (max-width: 768px)": {
          paddingBottom: "16px",
        },
      }}
    >
      <Grid
        templateAreas={{
          base: '"id" "kpi" "action"',
          lg: '"id kpi action"',
        }}
        templateColumns={{ base: "1fr", lg: "1.2fr 1.1fr 1fr" }}
        gap={{ base: 3, md: 6 }}
        alignItems="center"
        overflow="visible"
      >
        {/* Left column: Identity */}
        <HStack
          spacing={{ base: 2, md: 3 }}
          align="center"
          minW={0}
          gridArea="id"
        >
          <Image
            src={
              vault?.isSommNative
                ? "/assets/icons/alpha-steth.png"
                : (vault as any)?.logo
            }
            alt={vault?.name || "Vault"}
            boxSize={{ base: "40px", md: "48px" }}
            rounded="lg"
            flexShrink={0}
          />
          <VStack spacing={1} align="flex-start" minW={0} flex={1}>
            <HStack spacing={2} flexWrap="wrap" minW={0}>
              <Text
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="semibold"
                color="text.primary"
                noOfLines={1}
              >
                {vault?.name}
              </Text>
            </HStack>
            <HStack spacing={2} flexWrap="wrap">
              {vault?.isSommNative && (
                <Box
                  px={2}
                  py={0.5}
                  bg="brand.primary"
                  rounded="sm"
                  fontSize={{ base: "xs", md: "xs" }}
                  fontWeight="semibold"
                  color="text.primary"
                >
                  Somm-native
                </Box>
              )}
              {chainLogo && (
                <HStack
                  spacing={1}
                  px={2}
                  py={0.5}
                  rounded="full"
                  bg="rgba(36, 52, 255, 0.1)"
                >
                  <Avatar
                    name={chainLabel}
                    src={chainLogo}
                    background="transparent"
                    border="none"
                    sx={{ width: "16px", height: "16px" }}
                  />
                  <Text fontSize="xs" color="text.secondary">
                    {chainLabel}
                  </Text>
                </HStack>
              )}
            </HStack>
            {providerText && (
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="text.secondary"
                noOfLines={1}
              >
                {providerText}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* Center column: KPIs */}
        <Grid
          gridArea="kpi"
          templateColumns={{
            base: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={{ base: 2, md: 4 }}
          alignItems="center"
          minW={0}
        >
          <KPIBox label="TVL" value={safeValue(tvl)} align="left" />
          <KPIBox
            label="Net Value"
            value={safeValue(netValueFmt)}
            align="center"
          />
          {isAlpha ? (
            <VStack spacing={2} align="end" minW={0}>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="semibold"
                lineHeight={1}
                color="text.primary"
                isTruncated
              >
                {safeValue(approxNetFmt ?? netFmt)}
              </Text>
              <HStack spacing={1} align="center" overflow="visible">
                <Text
                  fontSize="xs"
                  color="text.secondary"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                  isTruncated
                >
                  Net APY
                </Text>
                <AlphaApyPopover />
              </HStack>
            </VStack>
          ) : (
            <KPIBox
              label="Net Rewards"
              value={safeValue(netFmt)}
              align="right"
            />
          )}
        </Grid>

        {/* Right column: Action */}
        <VStack
          gridArea="action"
          spacing={2}
          align={{ base: "stretch", md: "end" }}
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
                  variantStyle="secondary"
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
                  onMouseDown={(e) => e.stopPropagation()}
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
            <Text fontSize="xs" color="text.secondary">
              Available in: {remaining}
            </Text>
          )}
        </VStack>
      </Grid>

      {/* One-line description */}
      {oneLineDesc && (
        <Text
          mt={{ base: 3, md: 4 }}
          pt={{ base: 3, md: 4 }}
          borderTop="1px solid"
          borderColor="border.subtle"
          fontSize={{ base: "sm", md: "sm" }}
          color="text.secondary"
          noOfLines={{ base: 3, md: 2 }}
          whiteSpace="normal"
          wordBreak="break-word"
          overflowWrap="anywhere"
          lineHeight={1.5}
        >
          {oneLineDesc}
        </Text>
      )}
    </Box>
  )
}
