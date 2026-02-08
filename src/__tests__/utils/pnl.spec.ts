import { calculatePnlPercent } from "../../utils/pnl"

describe("calculatePnlPercent", () => {
  it("returns positive pnl when current value is above cost basis", () => {
    const result = calculatePnlPercent(1500, 1000)
    expect(result).toEqual({
      value: 50,
      formatted: "50.00%",
    })
  })

  it("returns negative pnl when current value is below cost basis", () => {
    const result = calculatePnlPercent(800, 1000)
    expect(result).toEqual({
      value: -20,
      formatted: "-20.00%",
    })
  })

  it("returns null when cost basis is zero or invalid", () => {
    expect(calculatePnlPercent(1000, 0)).toBeNull()
    expect(calculatePnlPercent(1000, -100)).toBeNull()
    expect(calculatePnlPercent(Number.NaN, 1000)).toBeNull()
  })
})
