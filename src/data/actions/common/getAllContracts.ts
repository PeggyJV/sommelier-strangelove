import {
  getContract,
  getProvider,
  fetchSigner,
  Signer,
  Provider,
} from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { AllContracts } from "../types"

export const getAllContracts = async (
  providerMap: Map<string, Provider>,
  signerMap: Map<string, Signer | undefined>
) => {
  let contracts: AllContracts = {}

  for (const [key, cellar] of Object.entries(cellarDataMap)) {
    const provider = providerMap.get(cellar.config.chain.id)
    const signer = signerMap.get(cellar.config.chain.id)

    // Make sure we have a provider before attempting to create a contract
    if (!provider) {
      throw new Error(
        `Provider for chain ${cellar.config.chain.id} not found`
      )
    }

    const cellarContract = getContract({
      address: cellar.config.cellar.address,
      abi: cellar.config.cellar.abi,
      signerOrProvider: provider,
    })

    const cellarSigner = getContract({
      address: cellar.config.cellar.address,
      abi: cellar.config.cellar.abi,
      signerOrProvider: signer || undefined,
    })

    const stakerContract =
      cellar.config.staker &&
      getContract({
        address: cellar.config.staker.address,
        abi: cellar.config.staker.abi,
        signerOrProvider: provider,
      })

    const stakerSigner =
      cellar.config.staker &&
      getContract({
        address: cellar.config.staker.address,
        abi: cellar.config.staker.abi,
        signerOrProvider: signer || undefined,
      })

    const cellarRouterSigner = getContract({
      address: cellar.config.cellarRouter.address,
      abi: cellar.config.cellarRouter.abi,
      signerOrProvider: signer || undefined,
    })

    const contract = {
      cellarContract,
      cellarSigner,
      stakerContract,
      stakerSigner,
      cellarRouterSigner,
      chain: cellar.config.chain.id,
    }

    contracts = {
      ...contracts,
      [cellar.config.cellar.address]: contract,
    }
  }

  return contracts
}
