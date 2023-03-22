interface GetPositionReturnValue {
  address: string
  percentage: number
}
export const getPositon = (
  positions?: string[],
  positionDistribution?: string[]
) => {
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
}
