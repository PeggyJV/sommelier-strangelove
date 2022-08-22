import { bech32 } from "bech32"
import { ethers } from "ethers"

const ZEROS = Buffer.alloc(12)

function getBytes(address: string) {
  const decoded = bech32.decode(address)

  return Buffer.from(bech32.fromWords(decoded.words))
}

export function getBytes32(address: string) {
  return Buffer.concat([ZEROS, getBytes(address)])
}

ethers.utils.formatBytes32String
