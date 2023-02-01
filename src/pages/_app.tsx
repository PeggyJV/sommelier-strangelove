import { ChakraProvider, DarkMode } from "@chakra-ui/react"
import { DialogProvider } from "context/dialogContext"
import type { AppProps } from "next/app"
import PlausibleProvider from "next-plausible"
import theme from "theme/index"

import { WagmiProvider } from "context/wagmiContext"
import { AlertDialog } from "components/AlertDialog"
import { Provider as GraphQLProvider } from "urql"
import { client as urqlClient } from "queries/client"
import "utils/analytics"
import { GlobalFonts } from "theme/GlobalFonts"
import { GeoProvider } from "context/geoContext"
import { DefaultSeo } from "next-seo"
import { useState } from "react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Prevent HTTP error 429
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            refetchOnMount: false,
          },
        },
      })
  )
  return (
    <QueryClientProvider
      key="somm-data-provider-query-key"
      client={queryClient}
    >
      <GraphQLProvider value={urqlClient}>
        <PlausibleProvider
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}
        >
          <ChakraProvider theme={theme}>
            <GeoProvider>
              <GlobalFonts />
              <DialogProvider>
                <WagmiProvider>
                  <DefaultSeo
                    title="Sommelier Finance"
                    description="Access to risk-managed, multi chain strategies powered by off-chain computation"
                    openGraph={{
                      type: "website",
                      url: "https://app.sommelier.finance/",
                      site_name: "Sommelier Finance",
                      images: [
                        {
                          url: "https://app.sommelier.finance/ogimage.png",
                          width: 1200,
                          height: 630,
                          alt: "Your dynamic DeFi strategy connoisseur",
                        },
                      ],
                    }}
                    twitter={{
                      handle: "@sommfinance",
                      site: "@site",
                      cardType: "summary_large_image",
                    }}
                  />
                  <DarkMode>
                    <Component {...pageProps} />
                  </DarkMode>
                  <AlertDialog />
                </WagmiProvider>
              </DialogProvider>
            </GeoProvider>
          </ChakraProvider>
        </PlausibleProvider>
      </GraphQLProvider>
    </QueryClientProvider>
  )
}

export default App
