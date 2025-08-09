// Intentionally do not import cellarDataMap to avoid ESM deps in Jest
import { classifyVaultType } from "../classifyVaultType"

// Note: Skipped by default to avoid ESM imports (wagmi) pulled via config in Jest.
describe.skip("classifyVaultType against current config", () => {
  it("classifies all config strategies as either legacy or new", () => {
    // This test is skipped; when enabling locally, import cellarDataMap above
    const all: any[] = []
    expect(Array.isArray(all)).toBe(true)

    const results = all.map((s) => ({
      name: s.name,
      deprecated: Boolean(s.deprecated),
      provider: s.strategyProvider?.title ?? "",
      vaultType: classifyVaultType({
        deprecated: s.deprecated,
        strategyProvider: s.strategyProvider,
      }),
    }))

    // Ensure only valid values
    results.forEach((r) => {
      expect(["legacy", "new"]).toContain(r.vaultType)
    })

    // Known legacy providers in config should map to legacy
    const legacyProviderMatches = results.filter((r) =>
      [
        "Seven Seas",
        "ClearGate",
        "Patache",
        "Silver Sun Capital Investments & Seven Seas",
      ].some((p) => r.provider.includes(p))
    )
    legacyProviderMatches.forEach((r) => {
      expect(r.vaultType).toBe("legacy")
    })

    // Deprecated strategies should map to legacy
    const deprecatedMatches = results.filter((r) => r.deprecated)
    deprecatedMatches.forEach((r) => {
      expect(r.vaultType).toBe("legacy")
    })

    // Optionally log a short summary to aid manual verification when running tests locally
    const summary = results.reduce(
      (acc, r) => {
        acc[r.vaultType]++
        return acc
      },
      { legacy: 0, new: 0 } as { legacy: number; new: number }
    )
    // eslint-disable-next-line no-console
    console.log("vaultType summary", summary)
  })
})
