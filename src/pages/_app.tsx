import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Head from "next/head"
import "../withdraw/withdraw.css"

// Wallet providers touch window, so the whole app renders client-side only.
const Providers = dynamic(() => import("../withdraw/Providers"), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Somm Withdrawals</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Withdraw your funds from Somm vaults." />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  )
}
