import { formatUnits } from "viem"

export const ZERO = BigInt(0)

export const formatDecimals = (
  value: string,
  decimals?: number,
  fixed?: number
) => {
  let conversion = decimals
    ? formatUnits(value, decimals)
    : "0"

  const decimalIndex = conversion.indexOf(".");
  if (decimalIndex !== -1) {

    conversion = conversion.slice(decimalIndex, fixed + 1);
  }

  return conversion
}
