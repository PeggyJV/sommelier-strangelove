import { ChakraProvider, DarkMode } from "@chakra-ui/react"
import { DialogProvider } from "context/dialogContext"
import type { AppProps } from "next/app"
import theme from "theme/index"

import dynamic from "next/dynamic"
const WagmiClientProvider = dynamic(
  () => import("providers/WagmiClientProvider"),
  { ssr: false }
)
import { AlertDialog } from "components/AlertDialog"
import "utils/analytics"
import { GlobalFonts } from "theme/GlobalFonts"
import { GeoProvider } from "context/geoContext"
import { DefaultSeo } from "next-seo"
import { QueryClientProvider } from "@tanstack/react-query"
import { reactQueryClient } from "utils/reactQuery"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { HomeProvider } from "data/context/homeContext"
import { reportWebVitals } from "utils/webVitals"

const App = ({ Component, pageProps }: AppProps) => {
  // Suppress unhandled promise rejections for user-rejected wallet actions to avoid dev overlay
  if (typeof window !== "undefined") {
    const handler = (event: PromiseRejectionEvent) => {
      try {
        const reason: any = event?.reason
        const msg = String(
          reason?.message || reason?.shortMessage || reason || ""
        )
        if (
          msg.includes("User rejected") ||
          msg.includes("User denied") ||
          msg.includes("MetaMask Tx Signature: User denied")
        ) {
          event.preventDefault()
        }
      } catch {}
    }
    const errorHandler = (event: ErrorEvent) => {
      try {
        const err: any = event?.error
        const msg = String(err?.message || event?.message || "")
        if (
          msg.includes("ContractFunctionExecutionError") &&
          (msg.includes("User rejected") ||
            msg.includes("User denied") ||
            msg.includes("MetaMask Tx Signature: User denied"))
        ) {
          event.preventDefault()
        }
      } catch {}
    }
    // Ensure we don't add multiple listeners on HMR
    ;(window as any).__somm_unhandledrejection_handler__ &&
      window.removeEventListener(
        "unhandledrejection",
        (window as any).__somm_unhandledrejection_handler__
      )
    window.addEventListener("unhandledrejection", handler)
    ;(window as any).__somm_unhandledrejection_handler__ = handler
    ;(window as any).__somm_error_handler__ &&
      window.removeEventListener(
        "error",
        (window as any).__somm_error_handler__ as any
      )
    window.addEventListener("error", errorHandler)
    ;(window as any).__somm_error_handler__ = errorHandler

    // Patch console.error to suppress known benign user-rejected messages in dev
    const originalConsoleError = console.error.bind(console)
    const patched = (...args: any[]) => {
      try {
        const text = args
          .map((a) => (a instanceof Error ? a.message : String(a)))
          .join(" ")
        if (
          text.includes("ContractFunctionExecutionError") &&
          (text.includes("User rejected") ||
            text.includes("User denied") ||
            text.includes("MetaMask Tx Signature: User denied"))
        ) {
          return
        }
      } catch {}
      originalConsoleError(...args)
    }
    ;(window as any).__somm_console_error__ &&
      (console.error = (window as any).__somm_console_error__)
    ;(window as any).__somm_console_error__ = patched
    console.error = patched
  }

  return (
    <QueryClientProvider client={reactQueryClient}>
      {/* <PlausibleProvider
        domain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL!}
      > */}
      <ChakraProvider theme={theme}>
        <GeoProvider>
          <GlobalFonts />
          <DialogProvider>
            <WagmiClientProvider>
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
            </WagmiClientProvider>
          </DialogProvider>
        </GeoProvider>
      </ChakraProvider>
      {/* </PlausibleProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Report Web Vitals
if (typeof window !== "undefined") {
  reportWebVitals()
}

export default App
