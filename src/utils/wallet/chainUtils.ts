import { switchChain } from "wagmi/actions"
import { config } from "../../lib/wagmi"
import { chainConfig } from "data/chainConfig"
import {
  ALCHEMY_API_KEY,
  INFURA_API_KEY,
  QUICKNODE_API_KEY,
} from "src/context/rpc_context"

type SwitchError = {
  code?: number
  message?: string
}

type EthereumRequestPayload = {
  method: string
  params?: readonly unknown[]
}

type EthereumProvider = {
  request: (payload: EthereumRequestPayload) => Promise<unknown>
}

const getSwitchError = (error: unknown): SwitchError => {
  if (!error || typeof error !== "object") return {}
  const candidate = error as { code?: unknown; message?: unknown }
  return {
    code:
      typeof candidate.code === "number"
        ? candidate.code
        : undefined,
    message:
      typeof candidate.message === "string"
        ? candidate.message
        : undefined,
  }
}

const getEthereumProvider = (): EthereumProvider | undefined => {
  if (typeof window === "undefined") return undefined
  return (
    window as Window & { ethereum?: EthereumProvider }
  ).ethereum
}

export async function requestSwitch(chainId: 1 | 42161 | 8453) {
  try {
    await switchChain(config, { chainId })
    return true
  } catch (e: unknown) {
    const switchError = getSwitchError(e)
    if (switchError.code === 4001)
      throw new Error("User canceled chain switch")
    if (
      switchError.message?.includes("Unrecognized chain ID")
    ) {
      throw new Error("Unsupported chain in wallet")
    }
    throw e
  }
}

export async function requestSwitchWithAdd(
  chainId: 1 | 42161 | 8453
) {
  try {
    await switchChain(config, { chainId })
    return true
  } catch (e: unknown) {
    const switchError = getSwitchError(e)
    const ethereum = getEthereumProvider()
    // If chain not added in wallet, try wallet_addEthereumChain
    if (switchError.code === 4902 && ethereum) {
      const chain = chainConfig.find((c) => c.wagmiId === chainId)
      if (!chain) {
        throw new Error("Chain configuration not found")
      }

      try {
        // Build provider URLs with API keys when available
        const keyedUrls = [
          chain.infuraRpcUrl && INFURA_API_KEY
            ? `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
            : undefined,
          chain.alchemyRpcUrl && ALCHEMY_API_KEY
            ? `${chain.alchemyRpcUrl}/${ALCHEMY_API_KEY}`
            : undefined,
          chain.quicknodeRpcUrl && QUICKNODE_API_KEY
            ? `${chain.quicknodeRpcUrl}/${QUICKNODE_API_KEY}`
            : undefined,
        ].filter(Boolean) as string[]

        // Public RPC fallbacks to avoid wallet prompting for provider login
        const publicFallbacks: Record<number, string[]> = {
          1: [
            "https://cloudflare-eth.com",
            "https://rpc.ankr.com/eth",
          ],
          42161: ["https://arb1.arbitrum.io/rpc"],
          10: ["https://mainnet.optimism.io"],
          8453: ["https://base-rpc.publicnode.com"],
        }
        const rpcUrls = keyedUrls.length
          ? keyedUrls
          : publicFallbacks[chainId] || []

        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + chainId.toString(16),
              chainName: chain.displayName,
              rpcUrls: rpcUrls.length ? rpcUrls : undefined,
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: [chain.blockExplorer?.url].filter(
                Boolean
              ),
            },
          ],
        })

        // Try switching again after adding
        await switchChain(config, { chainId })
        return true
      } catch (addErr: unknown) {
        const addMessage =
          getSwitchError(addErr).message ?? "Unknown error"
        throw new Error(
          `Failed to add network: ${addMessage}`
        )
      }
    }

    // Handle other errors
    if (switchError.code === 4001)
      throw new Error("User canceled chain switch")
    if (
      switchError.message?.includes("Unrecognized chain ID")
    ) {
      throw new Error("Unsupported chain in wallet")
    }
    throw e
  }
}

export function getChainById(chainId: 1 | 42161 | 8453) {
  return chainConfig.find((c) => c.wagmiId === chainId)
}

export function getChainDisplayName(
  chainId: 1 | 42161 | 8453
): string {
  const chain = getChainById(chainId)
  return chain?.displayName || `Chain ${chainId}`
}
