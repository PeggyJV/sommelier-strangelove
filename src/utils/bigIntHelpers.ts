import { formatUnits } from "viem"

export const ZERO = BigInt(0)

export const MaxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");


export const formatDecimals = (
  value: string,
  decimals?: number,
  fixed?: number
) => {
  let conversion = decimals
    ? formatUnits(BigInt(value), decimals)
    : "0"

  const decimalIndex = conversion.indexOf(".");
  if (decimalIndex !== -1 && fixed) {
    conversion = conversion.slice(decimalIndex, fixed + 1);
  }

  return conversion
}

export const pow = (base: bigint, exponent: bigint): bigint => {
  let result = 1n;
  for (let i = 0n; i < exponent; i++) {
    result *= base;
  }
  return result;
}
