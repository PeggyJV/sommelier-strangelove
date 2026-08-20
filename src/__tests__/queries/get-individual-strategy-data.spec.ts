import { fetchIndividualCellarStrategyData } from "queries/get-individual-strategy-data"

const mockFetch = (payload: unknown) => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({
    json: async () => payload,
  })
}

describe("fetchIndividualCellarStrategyData", () => {
  it("returns the unwrapped result for a healthy payload", async () => {
    const cellar = { id: "0xabc", tvlTotal: "1", shareValue: "2", dayDatas: [] }
    mockFetch({ result: { data: { cellar } } })

    const res = await fetchIndividualCellarStrategyData("0xabc", "ethereum")

    expect(res).toEqual({ data: { cellar } })
  })

  it("returns a destructurable shape when the API reports data_pending", async () => {
    mockFetch({
      cellarAddress: "0xabc",
      chain: "ethereum",
      status: "data_pending",
      shareValue: null,
      tvlTotal: null,
      baseAssetTvl: null,
      note: "no_hourly_data",
    })

    const res = await fetchIndividualCellarStrategyData("0xabc", "ethereum")

    // Must not be undefined: useStrategyData destructures `{ data, error }`.
    expect(res).toBeDefined()
    const { data, error } = res as { data?: unknown; error?: unknown }
    expect(data).toBeUndefined()
    expect(error).toBeUndefined()
  })
})
