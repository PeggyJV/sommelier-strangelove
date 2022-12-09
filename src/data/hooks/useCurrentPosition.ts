import { CellarKey, ConfigProps } from "data/types"
import { ethers } from "ethers"
import { CellarV0816 } from "src/abi/types"
import { useAccount, useQuery, useSigner } from "wagmi"
import { useCreateContracts } from "./useCreateContracts"
import erc20 from "src/abi/erc20.json"
import { useUserBalances } from "./useUserBalances"
import BigNumber from "bignumber.js"
import { config } from "src/utils/config"

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const provider = new ethers.providers.AlchemyProvider(
  "homestead",
  alchemyKey
)
const usdcAddress = config.CONTRACT.USDC.ADDRESS
const ERC20 = new ethers.Contract(usdcAddress, erc20, provider)

function toBN(value: any) {
  return new BigNumber(value.toString())
}

export const useCurrentPosition = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { lpToken } = useUserBalances(config)

  const query = useQuery(
    ["USE_CURRENT_POSITION", config.cellar.address, address],
    async () => {
      try {
        if (!address) throw new Error("address is undefined")
        if (config.cellar.key === CellarKey.CELLAR_V0816) {
          const contract: CellarV0816 = cellarContract
          // Returns max number of assets withdrawable by user
          const maxAssetsOut = await contract
            .maxWithdraw(address)
            .then(toBN) // Total shares across all users

          const maxSharesOut = await contract
            .convertToShares(maxAssetsOut.toString())
            .then(toBN)

          // Total shares minted by the Cellar
          const totalShares = await contract.totalSupply().then(toBN)

          // Positions held by the cellar
          const positionAddresses = await contract.getPositions()
          // Get balance of each position held by the Cellar
          const positionBalances = await Promise.all(
            positionAddresses.map(async (position) => {
              // Attach to ERC20 contract
              const c = ERC20.attach(position)

              const cellarBalance: BigNumber = await c
                .balanceOf(config.cellar.address)
                .then(toBN)
              const decimals: number = await c.decimals()
              console.log(cellarBalance)
              return {
                address: position,
                balance: cellarBalance,
                decimals,
              }
            })
          )

          // This percentage is the same across all positions held by the cellar
          const percentage = maxSharesOut.div(totalShares).times(100)
          const result = await Promise.all(
            positionBalances.map(async (position) => {
              // Cellar balance of position
              const { balance } = position

              // User balance = user withdrawable percentage * cellar balance
              const withdrawable = balance
                .times(maxSharesOut)
                .div(totalShares)

              return {
                ...position,
                withdrawable,
                percentage,
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
      enabled: Boolean(signer && address),
      refetchOnMount: true,
    }
  )

  return query
}
