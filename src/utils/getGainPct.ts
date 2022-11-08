export const getGainPct = (priceNow: number, priceBefore: number) => {
  return (priceNow - priceBefore) / priceBefore
}
