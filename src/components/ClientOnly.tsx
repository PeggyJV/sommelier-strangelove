import { ReactNode, useState, useEffect } from 'react'

/**
 * Component wrapper to render children only when mounted (client-side)
 *
 * - rendering wagmi related components
 * - rendering components using `window`
 */
const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{children}</> : null
}

export default ClientOnly
