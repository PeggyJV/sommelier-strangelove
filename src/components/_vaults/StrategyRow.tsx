import {
  Badge,
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
import KPIBox from "components/_vaults/KPIBox"
import ActionButton from "components/ui/ActionButton"
import { config as utilConfig } from "utils/config"

type Vault = {
  name?: string
  logo?: string
  isSommNative?: boolean
  provider?: { title?: string } | string
  builtWith?: string[]
  description?: string
  launchDate?: string | number | Date
  tvm?: { formatted?: string }
  baseApySumRewards?: { value?: number | string; formatted?: string }
  config?: {
    chain?: { displayName?: string; id?: string; logoPath?: string }
    cellar?: { address?: string }
  }
  slug?: string
}

export default function StrategyRow({ vault }: { vault: Vault }) {
  const { setIsOpen } = useDepositModalStore()
  const providerText =
    typeof vault?.provider === "string"
      ? vault.provider
      : vault?.provider?.title || ""
  const _built = Array.isArray(vault?.builtWith)
    ? vault?.builtWith
    : []
  const _netVal =
    typeof vault?.baseApySumRewards?.value === "string"
      ? parseFloat(vault?.baseApySumRewards?.value)
      : (vault?.baseApySumRewards?.value as number | undefined)
  const netFmt = vault?.baseApySumRewards?.formatted
  const isAlpha = vault?.slug === utilConfig.CONTRACT.ALPHA_STETH.SLUG
  const actionLabel = isAlpha ? "Migrate" : "Withdraw"
  const actionType = isAlpha ? "migrate" : "withdraw"
  const chainLabel = vault?.config?.chain?.displayName ?? "—"
  const chainLogo = vault?.config?.chain?.logoPath
  const launchDate = vault?.launchDate
    ? new Date(vault.launchDate)
    : undefined
  const launchDateMs = launchDate?.getTime()

  const isPreLaunch = useMemo(() => {
    return typeof launchDateMs === "number" && Date.now() < launchDateMs
  }, [launchDateMs])

  const safeValue = (v?: string | number | null) =>
    v === undefined || v === null || v === "" ? "–" : v

  // Helper text countdown (compact). Updates every second, rendered once below button
  const [remaining, setRemaining] = useState<string>("")
  useEffect(() => {
    if (typeof launchDateMs !== "number") return
    const tick = () => {
      const ms = launchDateMs - Date.now()
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
  }, [launchDateMs])

  const oneLineDesc = vault?.description?.length
    ? vault.description
    : "Dynamically reallocates stETH across Aave, Morpho, Unichain, and Mellow."

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        lg: isAlpha ? "minmax(0,1fr) auto" : "minmax(0,1fr) 140px auto",
      }}
      gap={{ base: 4, lg: 8 }}
      alignItems="center"
      // Prevent button clipping due to hidden overflow on grid/td parents
      overflow="visible"
    >
      {/* Identity + description */}
      <HStack spacing={4} align="center" minW={0}>
        <Image
          src={
            vault?.isSommNative
              ? "/assets/icons/alpha-steth.png"
              : vault?.logo
          }
          alt={vault?.name || "Vault"}
          boxSize={{ base: "36px", md: "44px" }}
          rounded="full"
          flexShrink={0}
        />
        <Box minW={0} flex={1}>
          <HStack spacing={2} flexWrap="wrap" minW={0}>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight={700}>
              {vault?.name}
            </Text>
            {vault?.isSommNative && (
              <Badge
                variant="outline"
                color="purple.light"
                borderColor="purple.base"
                boxShadow="none"
                borderWidth="1px"
                rounded="md"
                px={1.5}
                fontSize="2xs"
                fontWeight={600}
                letterSpacing="0.04em"
              >
                Somm-native
              </Badge>
            )}
          </HStack>
          <HStack
            spacing={2}
            mt={0.5}
            fontSize="xs"
            color="neutral.400"
            flexWrap="wrap"
          >
            {providerText && <Text>{providerText}</Text>}
            {providerText && chainLogo && <Text aria-hidden>·</Text>}
            {chainLogo && (
              <HStack spacing={1}>
                <Avatar
                  name={chainLabel}
                  src={chainLogo}
                  background="transparent"
                  border="none"
                  sx={{ width: "14px", height: "14px" }}
                />
                <Text>{chainLabel}</Text>
              </HStack>
            )}
          </HStack>
          {oneLineDesc && (
            <Text
              mt={2}
              fontSize="sm"
              color="neutral.300"
              noOfLines={{ base: 3, md: 2 }}
              maxW="900px"
            >
              {oneLineDesc}
            </Text>
          )}
        </Box>
      </HStack>

      {!isAlpha && (
        <KPIBox
          label="Net Rewards"
          value={safeValue(netFmt)}
          align="right"
        />
      )}

      {/* Primary action */}
      <VStack spacing={2} align={{ base: "stretch", lg: "end" }} minW={0}>
        <ConnectGate
          fallbackLabel={`Connect to ${actionLabel.toLowerCase()}`}
          overrideChainId={vault?.config?.chain?.id}
        >
          {isPreLaunch ? (
            <ActionButton
              variantStyle="primary"
              size="md"
              isDisabled
              onClick={(e) => e.stopPropagation()}
            >
              {actionLabel}
            </ActionButton>
          ) : (
            <ActionButton
              variantStyle="primary"
              size="md"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                if (!vault?.slug) return
                setIsOpen({ id: vault.slug, type: actionType })
              }}
            >
              {actionLabel}
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
  )
}
