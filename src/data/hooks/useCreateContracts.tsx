import { ConfigProps } from "data/types"
import { ContractInterface, ethers } from "ethers"
import { useSigner, useProvider, useContract } from "wagmi"

export const useCreateContracts = (config: ConfigProps) => {
  const { data: signer } = useSigner()
  const provider = useProvider()

  const stakerSigner = (() => {
    if (!config.staker || !signer) return
    return new ethers.Contract(
      config.staker.address,
      config.staker.abi as ContractInterface,
      signer
    )
  })()
  const cellarSigner = useContract({
    addressOrName: config.cellar.address,
    contractInterface: config.cellar.abi as ContractInterface,
    signerOrProvider: signer,
  })
  const stakerContract = (() => {
    if (!config.staker || !provider) return
    return new ethers.Contract(
      config.staker.address,
      config.staker.abi as ContractInterface,
      provider
    )
  })()
  const cellarContract = useContract({
    addressOrName: config.cellar.address,
    contractInterface: config.cellar.abi as ContractInterface,
    signerOrProvider: provider,
  })
  const cellarRouterSigner = useContract({
    addressOrName: config.cellarRouter.address,
    contractInterface: config.cellarRouter.abi as ContractInterface,
    signerOrProvider: signer,
  })

  const contracts = {
    stakerSigner,
    cellarSigner,
    stakerContract,
    cellarContract,
    cellarRouterSigner,
  }

  return contracts
}
