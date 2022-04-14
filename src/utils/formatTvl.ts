export const formatTvl = (tvlTotal?: string) => {
  const tvmVal =
    tvlTotal &&
    Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(parseInt(tvlTotal))

  return tvmVal
}
