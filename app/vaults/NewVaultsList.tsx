"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

type VaultItem = {
  id: string
  name: string
  logoUrl?: string
  chain: string
  tvl: { formatted: string }
}

export default function NewVaultsList() {
  const [items, setItems] = useState<VaultItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVaults() {
      try {
        const res = await fetch("/api/new-vaults")
        if (res.ok) {
          const data = await res.json()
          setItems(data || [])
        }
      } catch (e) {
        console.error("Failed to fetch vaults:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchVaults()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          color: "#B7BCC8",
        }}
      >
        Loading vaults...
      </div>
    )
  }

  if (!items?.length) {
    return (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          color: "#B7BCC8",
        }}
      >
        No vaults available
      </div>
    )
  }

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
          <VaultCard key={v.id} vault={v} />
        ))}
      </ul>
    </div>
  )
}

function VaultCard({ vault }: { vault: VaultItem }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <li
      style={{
        border: `1px solid ${
          isHovered ? "rgba(36, 52, 255, 0.5)" : "#292D36"
        }`,
        borderRadius: "16px",
        padding: "24px",
        background: isHovered ? "#1E2129" : "#1A1D25",
        transition: "border-color 0.15s ease, background 0.15s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        {vault.logoUrl && (
          <Image
            src={vault.logoUrl}
            alt={vault.name}
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
            {vault.name}
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
            {vault.tvl.formatted}
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
            {vault.chain}
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
  )
}
