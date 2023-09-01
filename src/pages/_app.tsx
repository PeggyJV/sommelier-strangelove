import { ChakraProvider, DarkMode } from "@chakra-ui/react"
import { DialogProvider } from "context/dialogContext"
import type { AppProps } from "next/app"
import PlausibleProvider from "next-plausible"
import theme from "theme/index"

import { WagmiProvider } from "context/wagmiContext"
import { AlertDialog } from "components/AlertDialog"
import "utils/analytics"
import { GlobalFonts } from "theme/GlobalFonts"
import { GeoProvider } from "context/geoContext"
import { DefaultSeo } from "next-seo"
import { useState } from "react"
import UrqlProvider from "context/urql/UrqlProvider"
import { QueryClientProvider } from "@tanstack/react-query"
import { reactQueryClient } from "utils/reactQuery"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { HomeProvider } from "data/context/homeContext"

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => reactQueryClient)

  return (
    <QueryClientProvider
      key="somm-data-provider-query-key"
      client={queryClient}
    >
      <UrqlProvider pageProps={pageProps}>
        <PlausibleProvider
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}
        >
          <ChakraProvider theme={theme}>
            <GeoProvider>
              <GlobalFonts />
              <DialogProvider>
                <WagmiProvider>
                  <HomeProvider>
                    <DefaultSeo
                      title="Sommelier Finance"
                      description="Access to risk-managed, multi chain vaults powered by off-chain computation"
                      openGraph={{
                        type: "website",
                        url: "https://app.sommelier.finance/",
                        site_name: "Sommelier Finance",
                        images: [
                          {
                            url: "https://app.sommelier.finance/ogimage.png",
                            width: 1200,
                            height: 630,
                            alt: "Your dynamic DeFi vault connoisseur",
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
                  </HomeProvider>
                </WagmiProvider>
              </DialogProvider>
            </GeoProvider>
          </ChakraProvider>
        </PlausibleProvider>
      </UrqlProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
