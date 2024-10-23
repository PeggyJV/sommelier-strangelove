import { ChakraProvider, DarkMode } from "@chakra-ui/react"
import { DialogProvider } from "context/dialogContext"
import type { AppProps } from "next/app"
import PlausibleProvider from "next-plausible"
import theme from "theme/index"

import { QueryProvider } from "context/wagmiContext"
import { AlertDialog } from "components/AlertDialog"
import "utils/analytics"
import { GlobalFonts } from "theme/GlobalFonts"
import { GeoProvider } from "context/geoContext"
import { DefaultSeo } from "next-seo"
import { QueryClientProvider } from "@tanstack/react-query"
import { reactQueryClient } from "utils/reactQuery"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { HomeProvider } from "data/context/homeContext"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <PlausibleProvider
        domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}
      >
        <ChakraProvider theme={theme}>
          <GeoProvider>
            <GlobalFonts />
            <DialogProvider>
              <QueryProvider>
                <HomeProvider>
                  <DefaultSeo
                    title="Somm Finance"
                    description="Access to risk-managed, multi chain vaults powered by off-chain computation"
                    // SEO configuration omitted for brevity
                  />
                  <DarkMode>
                    <Component {...pageProps} />
                  </DarkMode>
                  <AlertDialog />
                </HomeProvider>
              </QueryProvider>
            </DialogProvider>
          </GeoProvider>
        </ChakraProvider>
      </PlausibleProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
