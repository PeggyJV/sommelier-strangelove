import Image from "next/image"
import { getNewVaults } from "../_lib/getNewVaults"

export const dynamic = "force-static"

export default async function NewVaultsList() {
  const items = await getNewVaults()
  if (!items?.length) return null

  return (
    <div aria-label="Somm-native Vaults">
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: "16px",
        }}
      >
        {items.map((v) => (
          <li
            key={v.id}
            style={{
              border: "1px solid #292D36",
              borderRadius: "16px",
              padding: "24px",
              background: "#1A1D25",
              transition:
                "border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(36, 52, 255, 0.5)"
              e.currentTarget.style.background = "#1E2129"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#292D36"
              e.currentTarget.style.background = "#1A1D25"
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              {v.logoUrl && (
                <Image
                  src={v.logoUrl}
                  alt={v.name}
                  width={48}
                  height={48}
                  style={{ borderRadius: "12px", flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  {v.name}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#B7BCC8",
                    lineHeight: 1.4,
                  }}
                >
                  Dynamically managed vault with automated rebalancing
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #292D36",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#B7BCC8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  TVL
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  {v.tvl.formatted}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#B7BCC8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  Chain
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    background: "rgba(36, 52, 255, 0.1)",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#2434FF",
                    }}
                  />
                  {v.chain}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#B7BCC8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    background: "rgba(57, 194, 118, 0.1)",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#39C276",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#39C276",
                    }}
                  />
                  Live
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
