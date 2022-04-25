export const formatApy = (apy?: string) => {
  const apyVal = apy && (parseFloat(apy) * 100).toFixed(2)

  return apyVal
}
