import NewVaultsList from "./NewVaultsList"

export const revalidate = 60

export default function Page() {
  return (
    <main
      style={{
        padding: "48px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "40px" }}>
        <span
          style={{
            display: "inline-block",
            marginBottom: "12px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#B7BCC8",
            border: "1px solid #292D36",
            borderRadius: "9999px",
          }}
        >
          Vault Infrastructure
        </span>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 600,
            color: "#FFFFFF",
            marginBottom: "12px",
            lineHeight: 1.2,
          }}
        >
          Live Vaults
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#B7BCC8",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          Institutional strategies. Transparent execution. Accessible
          to all.
        </p>
      </div>

      {/* Vault List */}
      <NewVaultsList />
    </main>
  )
}
