import { tokenConfig } from "data/tokenConfig"

export const getPositon = async (
  positions?: string[],
  positionDistribution?: string[]
) => {
  try {
    const Total = positionDistribution!
      .map((value) => Number(value))
      .reduce((partialSum, a) => partialSum + a, 0)

    const tradedAssets = tokenConfig
      .filter((token) => positions!.includes(token.address))
      .map((value, index) => ({
        ...value,
        positionDistribution: `${(
          (Number(positionDistribution![index]) / Total) *
          100
        ).toFixed(2)}%`,
      }))

    return tradedAssets
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
