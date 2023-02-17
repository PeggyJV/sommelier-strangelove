import BigNumber from "bignumber.js"
import { CellarV0815, CellarV0816 } from "src/abi/types"
import { formatUSD, toEther } from "utils/formatCurrency"
import { useToken } from "wagmi"

export const getUserShareBalance = async ({
  cellarContract,
  address,
  activeAsset,
}: {
  cellarContract: CellarV0815 | CellarV0816
  address: string
  activeAsset: ReturnType<typeof useToken>["data"]
}) => {
  const shares = await cellarContract.balanceOf(address)
  const cellarShareBalance = await cellarContract.convertToAssets(
    shares
  )
  const nv = new BigNumber(
    toEther(cellarShareBalance, activeAsset?.decimals, false, 2)
  )
  const formattedNetValue = nv.toFixed(2, 0)
  return {
    value: nv,
    formatted: formatUSD(formattedNetValue),
  }
}
