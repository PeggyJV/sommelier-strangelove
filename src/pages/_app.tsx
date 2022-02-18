import { ChakraProvider } from '@chakra-ui/react'
import { DialogProvider } from 'context/dialogContext'
import type { AppProps } from 'next/app'
import PlausibleProvider from 'next-plausible'
import theme from 'theme/index'
import { QueryClientProvider, QueryClient } from 'react-query'
import { WagmiProvider } from 'context/wagmiContext'
import AlertDialog from 'components/AlertDialog'

import '@fontsource/oswald/700.css'

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}>
        <ChakraProvider theme={theme}>
          <DialogProvider>
            <WagmiProvider>
              <Component {...pageProps} />
              <AlertDialog />
            </WagmiProvider>
          </DialogProvider>
        </ChakraProvider>
      </PlausibleProvider>
    </QueryClientProvider>
  )
}

export default App
