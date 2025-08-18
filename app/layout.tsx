export const metadata = {
  title: "Sommelier",
  description: "Somm-native Vaults",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


