import { ChakraProvider } from "@chakra-ui/react"
import { DialogProvider } from "context/dialogContext"
import type { AppProps } from "next/app"
import PlausibleProvider from "next-plausible"
import theme from "theme/index"
import { QueryClientProvider, QueryClient } from "react-query"
import { WagmiProvider } from "context/wagmiContext"
import { AlertDialog } from "components/AlertDialog"
import { Provider as GraphQLProvider } from "urql"
import { client as urqlClient } from "queries/client"

import { GlobalFonts } from "theme/GlobalFonts"

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <GraphQLProvider value={urqlClient}>
        <PlausibleProvider
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}
        >
          <ChakraProvider theme={theme}>
            <GlobalFonts />
            <DialogProvider>
              <WagmiProvider>
                <Component {...pageProps} />
                <AlertDialog />
              </WagmiProvider>
            </DialogProvider>
          </ChakraProvider>
        </PlausibleProvider>
      </GraphQLProvider>
    </QueryClientProvider>
  )
}

export default App
