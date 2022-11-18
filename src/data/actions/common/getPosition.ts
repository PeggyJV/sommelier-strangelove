import { tokenConfig } from "data/tokenConfig"
interface GetPositionReturnValue {address: string, percentage: number}[]
export const getPositon = async (
  positions?: string[],
  positionDistribution?: string[]
) => {
  try {
   const total = positionDistribution!
      .map((value) => Number(value))
      .reduce((partialSum, a) => partialSum + a, 0)

    const distributions = positions?.map((address, index) => {
      const value = positionDistribution?.[index]
      return {
        address,
        percentage: (Number(value)/total) * 100
      }
    })
    
  return distributions
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
