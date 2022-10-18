import BigNumber from "bignumber.js"
import { ClearGateCellar } from "src/abi/types"
import { formatUSD, toEther } from "utils/formatCurrency"
import { useToken } from "wagmi"

export const getNetValue = async ({
  cellarContract,
  address,
  activeAsset,
}: {
  cellarContract: ClearGateCellar
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
