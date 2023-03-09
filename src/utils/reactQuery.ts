import { QueryClient } from "@tanstack/react-query"

export const reactQueryConfig = {
  defaultOptions: {
    queries: {
      // Prevent HTTP error 429
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: false,
    },
  },
}

export const reactQueryClient = new QueryClient(reactQueryConfig)
