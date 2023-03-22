import { tokenConfig } from "data/tokenConfig"

export const getTradedAssets = (item: string) => {
  const asset = tokenConfig.find((v) => v.symbol === item)
  return asset
}
