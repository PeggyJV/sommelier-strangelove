import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactNode } from "react"

interface ProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent HTTP error 429
      refetchOnWindowFocus: false,
    },
  },
})

export default function DataProvider({ children }: ProviderProps) {
  return (
    <QueryClientProvider
      key="somm-data-provider-query-key"
      client={queryClient}
    >
      {children}
    </QueryClientProvider>
  )
}
