import * as React from 'react'

/**
 * Component wrapper to render children only when mounted (client-side)
 *
 * - rendering wagmi related components
 * - rendering components using `window`
 */
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{children}</> : null
}

export default ClientOnly
