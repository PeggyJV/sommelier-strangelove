import { switchChain } from "wagmi/actions"
import { config } from "../../lib/wagmi"
import { chainConfig } from "data/chainConfig"

export async function requestSwitch(chainId: number) {
  try {
    await switchChain(config, { chainId })
    return true
  } catch (e: any) {
    if (e?.code === 4001) throw new Error("User canceled chain switch")
    if (e?.message?.includes("Unrecognized chain ID")) {
      throw new Error("Unsupported chain in wallet")
    }
    throw e
  }
}

export async function requestSwitchWithAdd(chainId: number) {
  try {
    await switchChain(config, { chainId })
    return true
  } catch (e: any) {
    // If chain not added in wallet, try wallet_addEthereumChain
    if (e?.code === 4902 && typeof window !== "undefined" && (window as any)?.ethereum) {
      const chain = chainConfig.find((c) => c.wagmiId === chainId)
      if (!chain) {
        throw new Error("Chain configuration not found")
      }

      try {
        const rpcUrls = [
          (chain as any).infuraRpcUrl,
          (chain as any).alchemyRpcUrl,
          (chain as any).quicknodeRpcUrl,
        ].filter(Boolean)

        await (window as any).ethereum.request({
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
              blockExplorerUrls: [
                chain.blockExplorer?.url,
              ].filter(Boolean),
            },
          ],
        })

        // Try switching again after adding
        await switchChain(config, { chainId })
        return true
      } catch (addErr: any) {
        throw new Error(`Failed to add network: ${addErr?.message ?? "Unknown error"}`)
      }
    }

    // Handle other errors
    if (e?.code === 4001) throw new Error("User canceled chain switch")
    if (e?.message?.includes("Unrecognized chain ID")) {
      throw new Error("Unsupported chain in wallet")
    }
    throw e
  }
}

export function getChainById(chainId: number) {
  return chainConfig.find((c) => c.wagmiId === chainId)
}

export function getChainDisplayName(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.displayName || `Chain ${chainId}`
}
