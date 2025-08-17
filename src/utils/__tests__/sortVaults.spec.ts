import { sortVaults } from "../sortVaults"

const fixtures = [
  { name: "Real Yield ETH (ETH)", tvl: "$7.44M", netValue: "$0.04" },
  { name: "Turbo stETH (ETH)", tvl: "$4.42M", netValue: "$0.00" },
  { name: "Real Yield ETH (OP)", tvl: "$1.81M", netValue: "–" },
  { name: "Real Yield ETH (ARB)", tvl: "$1.35M", netValue: "$0.79" },
  { name: "Real Yield BTC (ETH)", tvl: "$1.15M", netValue: "$0.00" },
  { name: "Real Yield USD (ETH)", tvl: "$561.12K", netValue: "$1.05" },
  { name: "Turbo rsETH (ETH)", tvl: "$157.60K", netValue: "$10.00" },
  { name: "Turbo eETH V2 (ETH)", tvl: "$71.47K", netValue: "$0.00" },
]

describe("sortVaults", () => {
  test("not connected → TVL desc", () => {
    const vaults = fixtures.map(f => ({
      name: f.name,
      metrics: { tvl: f.tvl },
      user: { netValue: f.netValue }
    }))
    
    const ordered = sortVaults(vaults, false)
    expect(ordered.map(v => v.name).slice(0, 3)).toEqual([
      "Real Yield ETH (ETH)",    // $7.44M
      "Turbo stETH (ETH)",       // $4.42M
      "Real Yield ETH (OP)",     // $1.81M
    ])
  })

  test("connected → Net Value desc, fallback TVL", () => {
    const vaults = fixtures.map(f => ({
      name: f.name,
      metrics: { tvl: f.tvl },
      user: { netValue: f.netValue }
    }))
    
    const ordered = sortVaults(vaults, true)
    expect(ordered.map(v => v.name).slice(0, 4)).toEqual([
      "Turbo rsETH (ETH)",       // $10.00
      "Real Yield USD (ETH)",    // $1.05
      "Real Yield ETH (ARB)",    // $0.79
      "Real Yield ETH (ETH)",    // $0.04, then others with 0/– by TVL
    ])
  })

  test("handles various net value formats", () => {
    const vaults = [
      { name: "Vault A", metrics: { tvl: "$1M" }, user: { netValue: "$1.00" } },
      { name: "Vault B", metrics: { tvl: "$2M" }, user: { netValue: "–" } },
      { name: "Vault C", metrics: { tvl: "$3M" }, user: { netValue: "$0.00" } },
      { name: "Vault D", metrics: { tvl: "$4M" }, user: { netValue: null } },
    ]
    
    const ordered = sortVaults(vaults, true)
    expect(ordered[0].name).toBe("Vault A") // Only one with positive net value
  })

  test("handles TVL with K/M/B suffixes", () => {
    const vaults = [
      { name: "Vault A", metrics: { tvl: "$1K" }, user: { netValue: "$0.00" } },
      { name: "Vault B", metrics: { tvl: "$1M" }, user: { netValue: "$0.00" } },
      { name: "Vault C", metrics: { tvl: "$1B" }, user: { netValue: "$0.00" } },
    ]
    
    const ordered = sortVaults(vaults, false)
    expect(ordered.map(v => v.name)).toEqual([
      "Vault C", // $1B
      "Vault B", // $1M
      "Vault A", // $1K
    ])
  })
})
