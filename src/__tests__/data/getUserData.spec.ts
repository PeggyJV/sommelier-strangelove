import { getUserDataWithContracts } from "data/actions/common/getUserData"
import { realYieldUsdArb } from "data/strategies/real-yield-usd-arb"

jest.mock("viem", () => jest.requireActual("viem"))

describe("getUserDataWithContracts", () => {
  it("returns an Arbitrum RYUSD holder's six-decimal share balance", async () => {
    const balanceOf = jest.fn().mockResolvedValue(1_250_000n)
    const userAddress = "0x1111111111111111111111111111111111111111"

    const result = await getUserDataWithContracts({
      contracts: {
        cellarContract: { read: { balanceOf } },
        chain: "arbitrum",
      },
      address: realYieldUsdArb.config.cellar.address,
      strategyData: {
        tokenPrice: "$1.10",
        slug: realYieldUsdArb.slug,
      } as never,
      userAddress,
      sommPrice: "0",
      baseAssetPrice: "1",
      chain: "arbitrum",
    })

    expect(balanceOf).toHaveBeenCalledWith([userAddress])
    expect(result.userStrategyData.userData.shares).toEqual({
      formatted: "1.25",
      value: 1_250_000n,
    })
    expect(result.userStrategyData.userData.netValue).toEqual({
      formatted: "$1.38",
      value: 1.375,
    })
  })
})
