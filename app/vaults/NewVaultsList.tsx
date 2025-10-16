import Image from "next/image"
import { getNewVaults } from "../_lib/getNewVaults"

export const dynamic = "force-static"

export default async function NewVaultsList() {
  const items = await getNewVaults()
  if (!items?.length) return null

  return (
    <div aria-label="Somm-native Vaults">
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((v) => (
          <li
            key={v.id}
            style={{
              border:
                "1px solid var(--chakra-colors-surface-secondary)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 12,
              background: "var(--chakra-colors-surface-primary)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              {v.logoUrl && (
                <Image
                  src={v.logoUrl}
                  alt={v.name}
                  width={40}
                  height={40}
                  style={{ borderRadius: 20 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800 }}>{v.name}</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>
                  {v.chain}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>
                  {v.tvl.formatted}
                </div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>TVL</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
