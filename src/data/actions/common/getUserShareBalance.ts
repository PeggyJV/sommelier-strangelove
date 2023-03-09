import BigNumber from "bignumber.js"
import { CellarV0815, CellarV0816 } from "src/abi/types"
import { formatUSD, toEther } from "utils/formatCurrency"

export const getUserShareBalance = async ({
  cellarContract,
  address,
  decimals,
}: {
  cellarContract: CellarV0815 | CellarV0816
  address: string
  decimals?: number
}) => {
  if (!decimals) return
  const shares = await cellarContract.balanceOf(address)
  const cellarShareBalance = await cellarContract.convertToAssets(
    shares
  )
  const nv = new BigNumber(
    toEther(cellarShareBalance, decimals, false, 2)
  )
  const formattedNetValue = nv.toFixed(2, 0)
  return {
    value: nv,
    formatted: formatUSD(formattedNetValue),
  }
}
