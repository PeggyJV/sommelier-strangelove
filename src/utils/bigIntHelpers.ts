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

export const bigIntToFixed = (value: bigint, dp: number = 0, rm: number = 4): string => {
  const factor = BigInt(10 ** dp);

  let scaledValue = value * factor;

  let roundedValue;
  if (rm === 0) {
    roundedValue = scaledValue;
  } else if (rm === 4) {
    roundedValue = (value * factor) + (factor / BigInt(2));
  } else {
    throw new Error("Unsupported rounding mode");
  }

  let result = roundedValue.toString();
  if (dp > 0) {
    result = result.padStart(dp + 1, '0');
    const integerPart = result.slice(0, -dp);
    const decimalPart = result.slice(-dp);
    result = `${integerPart}.${decimalPart}`;
  }

  return result;
}
