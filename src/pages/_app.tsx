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
import { AaveV2CellarProvider } from "context/aaveV2StablecoinCellar"
import { AaveStakerProvider } from "context/aaveStakerContext"
import { GlobalFonts } from "theme/GlobalFonts"
import { GeoProvider } from "context/geoContext"
import CompositeDataProvider from "src/composite-data/provider/compositeDataProvider"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GraphQLProvider value={urqlClient}>
      <PlausibleProvider
        domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}
      >
        <GeoProvider>
          <ChakraProvider theme={theme}>
            <GlobalFonts />
            <DialogProvider>
              <WagmiProvider>
                <AaveV2CellarProvider>
                  <AaveStakerProvider>
                    <CompositeDataProvider>
                      <Component {...pageProps} />
                    </CompositeDataProvider>
                  </AaveStakerProvider>
                </AaveV2CellarProvider>
                <AlertDialog />
              </WagmiProvider>
            </DialogProvider>
          </ChakraProvider>
        </GeoProvider>
      </PlausibleProvider>
    </GraphQLProvider>
  )
}

export default App
