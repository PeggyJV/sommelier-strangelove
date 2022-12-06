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

          let totalWithdrawable = new BigNumber(0)
          positionBalances.map((item) => {
            totalWithdrawable = totalWithdrawable.plus(
              new BigNumber(item.balance)
                .multipliedBy(maxSharesOut)
                .div(totalShares)
            )
          })

          const result = await Promise.all(
            positionBalances.map(async (item) => {
              const withdrawable = new BigNumber(item.balance)
                .multipliedBy(maxSharesOut)
                .div(totalShares)

              const ratio = new BigNumber(withdrawable).div(
                totalWithdrawable
              )

              return {
                address: item.address,
                balance: item.balance,
                decimals: item.decimals,
                withdrawable: withdrawable.multipliedBy(item.balance),
                percentage: ratio.multipliedBy(100),
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
