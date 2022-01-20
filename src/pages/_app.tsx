import { ChakraProvider } from '@chakra-ui/react'
import { DialogProvider } from 'context/dialogContext'
import type { AppProps } from 'next/app'
import PlausibleProvider from 'next-plausible'
import theme from 'theme/index'
import { QueryClientProvider, QueryClient } from 'react-query'
import { MetaMaskProvider } from 'context/metaMaskContext'
import AlertDialog from 'components/AlertDialog'

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}>
        <ChakraProvider theme={theme}>
          <DialogProvider>
            <MetaMaskProvider>
              <Component {...pageProps} />
              <AlertDialog />
            </MetaMaskProvider>
          </DialogProvider>
        </ChakraProvider>
      </PlausibleProvider>
    </QueryClientProvider>
  )
}

export default App
