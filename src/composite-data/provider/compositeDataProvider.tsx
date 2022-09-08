import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactNode } from "react"

interface ProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient({})

export default function CompositeDataProvider({
  children,
}: ProviderProps) {
  return (
    <QueryClientProvider key="somm-query-key" client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
