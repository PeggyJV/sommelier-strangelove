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
    address: config.cellar.address,
    abi: config.cellar.abi,
    signerOrProvider: signer,
  })
  const stakerContract = (() => {
    if (!config.staker || !provider) return
    return new ethers.Contract(
      config.staker.address,
      config.staker.abi,
      provider
    )
  })()
  const cellarContract = useContract({
    address: config.cellar.address,
    abi: config.cellar.abi,
    signerOrProvider: provider,
  })
  const cellarRouterSigner = useContract({
    address: config.cellarRouter.address,
    abi: config.cellarRouter.abi,
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
