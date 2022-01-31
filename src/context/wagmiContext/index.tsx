import * as React from 'react'
import { Provider } from 'wagmi'

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider autoConnect>
      {children}
      {/*  */}
    </Provider>
  )
}
