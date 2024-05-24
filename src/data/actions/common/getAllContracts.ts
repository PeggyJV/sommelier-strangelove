import { getContract } from "viem"
import { cellarDataMap } from "data/cellarDataMap"
import { AllContracts } from "../types"

export const getAllContracts = async (
  providerMap: Map<string, Object>,
  signerMap: Map<string, Object | undefined>
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
      client: provider,
    })

    const cellarSigner = getContract({
      address: cellar.config.cellar.address,
      abi: cellar.config.cellar.abi,
      client: signer || undefined,
    })

    const stakerContract =
      cellar.config.staker &&
      getContract({
        address: cellar.config.staker.address,
        abi: cellar.config.staker.abi,
        client: provider,
      })

    const stakerSigner =
      cellar.config.staker &&
      getContract({
        address: cellar.config.staker.address,
        abi: cellar.config.staker.abi,
        client: signer || undefined,
      })

    const cellarRouterSigner = getContract({
      address: cellar.config.cellarRouter.address,
      abi: cellar.config.cellarRouter.abi,
      client: signer || undefined,
    })

    const contract = {
      cellarContract,
      cellarSigner,
      stakerContract,
      stakerSigner,
      cellarRouterSigner,
      chain: cellar.config.chain.id,
    }

    let chainId = ''
    if (cellar.config.chain.id !== 'ethereum'){
      chainId = `-${cellar.config.chain.id}`
    }

    contracts = {
      ...contracts,
      [`${cellar.config.cellar.address}${chainId}`]: contract,
    }
  }

  return contracts
}
