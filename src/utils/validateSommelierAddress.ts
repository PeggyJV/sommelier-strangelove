import { bech32 } from "bech32"

const SOMMELIER_ADDRESS_PREFIX = "somm"

export const validateSommelierAddress = (address: string) => {
  if (!address) return false
  try {
    return bech32.decode(address).prefix === SOMMELIER_ADDRESS_PREFIX
  } catch (error) {
    return false
  }
}
