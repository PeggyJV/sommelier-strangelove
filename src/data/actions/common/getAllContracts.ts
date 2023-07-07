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
      address: config.cellar.address,
      abi: config.cellar.abi as ContractInterface,
      signerOrProvider: provider,
    })
    const cellarSigner = getContract({
      address: config.cellar.address,
      abi: config.cellar.abi as ContractInterface,
      // @ts-ignore
      signerOrProvider: signer,
    })

    const stakerContract =
      config.staker &&
      getContract({
        address: config.staker.address,
        abi: config.staker.abi as ContractInterface,
        signerOrProvider: provider,
      })
    const stakerSigner =
      config.staker &&
      getContract({
        address: config.staker.address,
        abi: config.staker.abi as ContractInterface,
        // @ts-ignore
        signerOrProvider: signer,
      })

    const cellarRouterSigner = getContract({
      addres: config.cellarRouter.address,
      abi: config.cellarRouter.abi as ContractInterface,
      // @ts-ignore
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
