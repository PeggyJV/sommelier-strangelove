import { getContract, getProvider, fetchSigner } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { ContractInterface } from "ethers"
import { AllContracts } from "../types"

export const getAllContracts = async () => {
  const signer = await fetchSigner()
  const provider = getProvider()
  let contracts: AllContracts = {}
  Object.values(cellarDataMap).forEach(({ config }) => {
    const cellarContract = getContract({
      addressOrName: config.cellar.address,
      contractInterface: config.cellar.abi as ContractInterface,
      signerOrProvider: provider,
    })
    const cellarSigner = getContract({
      addressOrName: config.cellar.address,
      contractInterface: config.cellar.abi as ContractInterface,
      signerOrProvider: signer,
    })

    const stakerContract =
      config.staker &&
      getContract({
        addressOrName: config.staker.address,
        contractInterface: config.staker.abi as ContractInterface,
        signerOrProvider: provider,
      })
    const stakerSigner =
      config.staker &&
      getContract({
        addressOrName: config.staker.address,
        contractInterface: config.staker.abi as ContractInterface,
        signerOrProvider: signer,
      })

    const cellarRouterSigner = getContract({
      addressOrName: config.cellarRouter.address,
      contractInterface: config.cellarRouter.abi as ContractInterface,
      signerOrProvider: signer,
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
