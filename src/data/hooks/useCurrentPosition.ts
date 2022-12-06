import { CellarKey, ConfigProps } from "data/types"
import { ContractInterface, ethers } from "ethers"
import { CellarV0816 } from "src/abi/types"
import { useAccount, useQuery, useSigner } from "wagmi"
import { useCreateContracts } from "./useCreateContracts"
import erc20 from "src/abi/erc20.json"
import { useUserBalances } from "./useUserBalances"
import BigNumber from "bignumber.js"

export const useCurrentPosition = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { lpToken } = useUserBalances(config)

  const query = useQuery(
    [
      "USE_CURRENT_POSITION",
      config.cellar.address,
      address,
      lpToken.data?.value,
    ],
    async () => {
      try {
        if (!lpToken.data?.value)
          throw new Error("lpToken is undefined")
        if (!address) throw new Error("address is undefined")
        if (config.cellar.key === CellarKey.CELLAR_V0816) {
          const contract: CellarV0816 = cellarContract
          const maxSharesOut = await contract
            .maxWithdraw(address)
            .then((v) => new BigNumber(v.toString())) // Returns # of shares withdrawable by user, <= total user shares
          const totalShares = await contract
            .totalSupply()
            .then((v) => new BigNumber(v.toString())) // Total shares across all users

          const positionAddresses = await contract.getPositions()
          const positionBalances = await Promise.all(
            positionAddresses.map(async (position) => {
              const c = new ethers.Contract(
                position,
                erc20 as ContractInterface,
                signer?.provider
              )
              const cellarBalance: BigNumber = await c
                .balanceOf(config.cellar.address)
                .then(
                  (v: ethers.BigNumber) => new BigNumber(v.toString())
                )
              const decimals: number = await c.decimals()

              return {
                address: position,
                balance: cellarBalance,
                decimals,
              }
            })
          )
          let totalBalances = new BigNumber(0)
          await Promise.all(
            positionBalances.map(async (item) => {
              const toShares = await contract.convertToShares(
                ethers.BigNumber.from(item.balance.toString())
              )
              totalBalances = totalBalances.plus(
                new BigNumber(toShares.toString())
              )
            })
          )

          const result = await Promise.all(
            positionBalances.map(async (item) => {
              const toShares = await contract.convertToShares(
                ethers.BigNumber.from(item.balance.toString())
              )
              const withdrawable = new BigNumber(toShares.toString())
                .multipliedBy(maxSharesOut)
                .div(totalShares)

              return {
                address: item.address,
                balance: item.balance,
                decimals: item.decimals,
                withdrawable,
                percentage: new BigNumber(toShares.toString())
                  .div(totalBalances)
                  .multipliedBy(100),
              }
            })
          )

          return result
        }

        throw new Error("UNKNOWN CONTRACT")
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    {
      enabled: Boolean(signer && address && lpToken.data?.value),
      refetchOnMount: true,
    }
  )

  return query
}
