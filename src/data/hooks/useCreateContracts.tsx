import { StrategyContracts } from "data/actions/types"
import { ConfigProps } from "data/types"
import { Contract, ContractInterface, ethers } from "ethers"
import { useSigner, useProvider, useContract } from "wagmi"

export const useCreateContracts = (config: ConfigProps) => {
  const { data: signer } = useSigner()
  const provider = useProvider()
  const chain = config.chain.id

  const stakerSigner = (() => {
    if (!config.staker || !signer) return
    return new ethers.Contract(
      config.staker.address,
      config.staker.abi as ContractInterface,
      signer
    )
  })()
  const cellarSigner: Contract = useContract({
    address: config.cellar.address,
    abi: config.cellar.abi,
    signerOrProvider: signer,
  })!
  const stakerContract = (() => {
    if (!config.staker || !provider) return
    return new ethers.Contract(
      config.staker.address,
      config.staker.abi,
      provider
    )
  })()
  const cellarContract: Contract = useContract({
    address: config.cellar.address,
    abi: config.cellar.abi,
    signerOrProvider: provider,
  })!
  const cellarRouterSigner: Contract = useContract({
    address: config.cellarRouter.address,
    abi: config.cellarRouter.abi,
    signerOrProvider: signer,
  })!

  const contracts: StrategyContracts = {
    stakerSigner,
    cellarSigner,
    stakerContract,
    cellarContract,
    cellarRouterSigner,
    chain,
  }

  return contracts
}
