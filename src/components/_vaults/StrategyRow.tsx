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
import KPIBox from "components/_vaults/KPIBox"
import ActionButton from "components/ui/ActionButton"

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
  const tvl = vault?.tvm?.formatted
  const netVal =
    typeof vault?.baseApySumRewards?.value === "string"
      ? parseFloat(vault?.baseApySumRewards?.value)
      : (vault?.baseApySumRewards?.value as number | undefined)
  const netFmt = vault?.baseApySumRewards?.formatted
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
  const { data: userStratData } =
    strategyAddress && strategyChainId
      ? useUserStrategyData(strategyAddress, strategyChainId)
      : ({} as any)
  const netValueFmt: string | undefined = (userStratData as any)
    ?.userStrategyData?.userData?.netValue?.formatted

  const safeValue = (v?: string | number | null) =>
    v === undefined || v === null || v === "" || v === 0 || v === "0"
      ? "–"
      : v

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
    <Box>
      <Grid
        templateColumns={{ base: "1fr", md: "1.2fr 1.1fr 1fr" }}
        gap={{ base: 4, md: 6 }}
        alignItems="center"
      >
        {/* Left column: Identity */}
        <HStack spacing={3} align="center" minW={0}>
          <Image
            src={
              vault?.isSommNative
                ? "/assets/icons/alpha-steth.png"
                : (vault as any)?.logo
            }
            alt={vault?.name || "Vault"}
            boxSize="40px"
            rounded="full"
          />
          <VStack spacing={1} align="flex-start" minW={0}>
            <HStack spacing={2} flexWrap="wrap" minW={0}>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight={800}
                noOfLines={1}
              >
                {vault?.name}
              </Text>
            </HStack>
            <HStack spacing={2} flexWrap="wrap">
              {vault?.isSommNative && (
                <Badge colorScheme="blue">Somm-native</Badge>
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
                    sx={{ width: "18px", height: "18px" }}
                  />
                  <Text fontSize="xs" color="whiteAlpha.800">
                    {chainLabel}
                  </Text>
                </HStack>
              )}
            </HStack>
            {providerText && (
              <Text
                fontSize="sm"
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
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={4}
          alignItems="center"
        >
          <KPIBox label="TVL" value={safeValue(tvl)} align="left" />
          <KPIBox
            label="Net Value"
            value={safeValue(netValueFmt)}
            align="center"
          />
          <KPIBox
            label="Net Rewards"
            value={safeValue(netFmt)}
            align="right"
          />
        </Grid>

        {/* Right column: chain + primary action with single helper */}
        <VStack spacing={2} align={{ base: "stretch", md: "end" }}>
          <ConnectGate
            fallbackLabel="Connect wallet to deposit"
            fullWidth
            overrideChainId={(vault as any)?.config?.chain?.id}
          >
            {isPreLaunch ? (
              <ActionButton
                variantStyle="primary"
                size="md"
                isDisabled
                onClick={(e) => e.stopPropagation()}
              >
                Deposit
              </ActionButton>
            ) : (
              <ActionButton
                variantStyle="primary"
                size="md"
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
          {isPreLaunch && remaining && (
            <Text fontSize="xs" color="neutral.400">
              Available in: {remaining}
            </Text>
          )}
        </VStack>
      </Grid>

      {/* One-line description */}
      {oneLineDesc && (
        <Text mt={3} fontSize="sm" color="neutral.300" noOfLines={1}>
          {oneLineDesc}
        </Text>
      )}
    </Box>
  )
}
