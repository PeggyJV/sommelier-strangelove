import { ChakraProvider } from "@chakra-ui/react"
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
import DataProvider from "data/provider/dataProvider"
import { DefaultSeo } from "next-seo"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GraphQLProvider value={urqlClient}>
      <PlausibleProvider
        domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}
      >
        <ChakraProvider theme={theme}>
          <GeoProvider>
            <GlobalFonts />
            <DialogProvider>
              <WagmiProvider>
                <DataProvider>
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
                  <Component {...pageProps} />
                </DataProvider>
                <AlertDialog />
              </WagmiProvider>
            </DialogProvider>
          </GeoProvider>
        </ChakraProvider>
      </PlausibleProvider>
    </GraphQLProvider>
  )
}

export default App
