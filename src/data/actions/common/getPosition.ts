interface GetPositionReturnValue {
  address: string
  percentage: number
}
export const getPositon = async (
  positions?: string[],
  positionDistribution?: string[]
): Promise<GetPositionReturnValue[] | undefined> => {
  try {
    const total = positionDistribution!
      .map((value) => Number(value))
      .reduce((partialSum, a) => partialSum + a, 0)

    const distributions = positions?.map((address, index) => {
      const value = positionDistribution?.[index]
      return {
        address,
        percentage:
          Number(value) === 0 ? 0 : (Number(value) / total) * 100,
      }
    })

    return distributions
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
