import type { NextApiRequest, NextApiResponse } from "next"
import { cellarDataMap } from "data/cellarDataMap"
import { classifyVaultType } from "utils/classifyVaultType"

type VaultTypeSummary = {
  legacy: number
  new: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const verboseParam = String(
      req.query.verbose || "0"
    ).toLowerCase()
    const verbose = verboseParam === "1" || verboseParam === "true"

    const results = Object.values(cellarDataMap).map((s) => {
      const providerTitle = s.strategyProvider?.title ?? ""
      const vaultType = classifyVaultType({
        deprecated: s.deprecated,
        strategyProvider: s.strategyProvider,
      })

      return {
        name: s.name,
        slug: s.slug,
        deprecated: Boolean(s.deprecated),
        providerTitle,
        vaultType,
      }
    })

    const summary = results.reduce<VaultTypeSummary>(
      (acc, r) => {
        acc[r.vaultType] += 1
        return acc
      },
      { legacy: 0, new: 0 }
    )

    if (verbose) {
      // eslint-disable-next-line no-console
      console.log("vault-type verbose listing:")
      results.forEach((r) => {
        // eslint-disable-next-line no-console
        console.log(
          `${r.vaultType.toUpperCase()} | deprecated=${
            r.deprecated ? "Y" : "N"
          } | provider=${r.providerTitle} | ${r.name} (${r.slug})`
        )
      })
    }

    // eslint-disable-next-line no-console
    console.log("vault-type summary:", summary)

    res.status(200).json({ summary, results })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("/api/debug/vault-types error", e)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
