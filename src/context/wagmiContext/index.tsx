import { ReactNode, useState } from "react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

// Deprecated: server-side Wagmi configuration moved to client-only provider to avoid ESM crashes
export const wagmiConfig: undefined = undefined

export const QueryProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {/* WagmiProvider is now provided by WagmiClientProvider in _app.tsx */}
      {children}
    </QueryClientProvider>
  )
}
