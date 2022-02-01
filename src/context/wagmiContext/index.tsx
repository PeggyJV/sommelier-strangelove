import { ReactNode } from 'react'
import { Provider } from 'wagmi'

export const WagmiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider autoConnect={false}>
      {children}
      {/*  */}
    </Provider>
  )
}
