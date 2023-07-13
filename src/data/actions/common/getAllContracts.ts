import { getContract, getProvider, fetchSigner } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { AllContracts } from "../types"

export const getAllContracts = async () => {
  const signer = await fetchSigner()
  const provider = getProvider()
  let contracts: AllContracts = {}
  Object.values(cellarDataMap).forEach(({ config }) => {
    const cellarContract = getContract({
      address: config.cellar.address,
      abi: config.cellar.abi,
      signerOrProvider: provider,
    })
    const cellarSigner = getContract({
      address: config.cellar.address,
      abi: config.cellar.abi,
      signerOrProvider: signer || undefined,
    })

    const stakerContract =
      config.staker &&
      getContract({
        address: config.staker.address,
        abi: config.staker.abi,
        signerOrProvider: provider,
      })
    const stakerSigner =
      config.staker &&
      getContract({
        address: config.staker.address,
        abi: config.staker.abi,
        signerOrProvider: signer || undefined,
      })

    const cellarRouterSigner = getContract({
      address: config.cellarRouter.address,
      abi: config.cellarRouter.abi,
      signerOrProvider: signer || undefined,
    })

    const contract = {
      cellarContract,
      cellarSigner,
      stakerContract,
      stakerSigner,
      cellarRouterSigner,
    }

    contracts = { ...contracts, [config.cellar.address]: contract }
  })
  return contracts
}
