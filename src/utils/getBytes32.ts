import { bech32 } from "bech32"

const ZEROS = new Uint8Array(12)

function getBytes(address: string) {
  const decoded = bech32.decode(address)
  return new Uint8Array(bech32.fromWords(decoded.words))
}

export function getBytes32(address: string) {
  const bytes = getBytes(address)
  const result = new Uint8Array(32)
  result.set(ZEROS, 0)
  result.set(bytes, 12)
  return result
}
