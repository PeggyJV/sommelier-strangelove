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
import { useEffect } from "react"
import TagManager from "react-gtm-module"

const gtmId = process.env.NEXT_PUBLIC_GTM_ID
const gtmAuth = process.env.NEXT_PUBLIC_GTM_AUTH
const gtmPreview = process.env.NEXT_PUBLIC_GTM_PREVIEW

import { GlobalFonts } from "theme/GlobalFonts"

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient()
  useEffect(() => {
    if (gtmId != null) {
      TagManager.initialize({
        gtmId,
        auth: gtmAuth,
        preview: gtmPreview,
      })
    }
  }, [])

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
