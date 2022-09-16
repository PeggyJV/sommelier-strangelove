import { ConfigProps } from "data/cellarDataMap"
import { ContractInterface } from "ethers"
import { useSigner, useProvider, useContract } from "wagmi"

export const useCreateContracts = (config: ConfigProps) => {
  const { data: signer } = useSigner()
  const provider = useProvider()

  const stakerSigner = useContract({
    addressOrName: config.staker.address,
    contractInterface: config.staker.abi as ContractInterface,
    signerOrProvider: signer,
  })
  const cellarSigner = useContract({
    addressOrName: config.cellar.address,
    contractInterface: config.cellar.abi as ContractInterface,
    signerOrProvider: signer,
  })
  const stakerContract = useContract({
    addressOrName: config.staker.address,
    contractInterface: config.staker.abi as ContractInterface,
    signerOrProvider: provider,
  })
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
