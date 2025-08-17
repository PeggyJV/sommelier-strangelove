import { ReactNode, useState } from "react"
import { WagmiProvider } from "wagmi"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ALCHEMY_API_KEY, ALCHEMY_API_URL } from "context/rpc_context"

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "c11d8ffaefb8ba4361ae510ed7690cb8"

// Deprecated: server-side Wagmi configuration moved to client-only provider to avoid ESM crashes
export const wagmiConfig = undefined as any

export const QueryProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {/* WagmiProvider is provided by client-only WagmiClientProvider in _app.tsx */}
      <WagmiProvider config={{} as any}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
