import NewVaultsList from "./NewVaultsList"

export const revalidate = 60

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        Somm-native Vaults
      </h1>
      {/* Renders server-side, minimal client JS */}
      <NewVaultsList />
    </main>
  )
}


