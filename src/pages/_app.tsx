import { ChakraProvider } from '@chakra-ui/react'
import { DialogProvider } from 'context/dialogContext'
import type { AppProps } from 'next/app'
import PlausibleProvider from 'next-plausible'
import theme from 'theme/index'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}>
      <ChakraProvider theme={theme}>
        <DialogProvider>
          <Component {...pageProps} />
        </DialogProvider>
      </ChakraProvider>
    </PlausibleProvider>
  )
}
