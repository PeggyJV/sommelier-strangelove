import { initUrqlClient } from "context/urql/initUrqlClient"
import { useMemo } from "react"
/**
 * Simple hook to initialize the client with the pageProps.
 * @param pageProps - props of page
 * @returns urqlClient
 */
const url = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT!

export const useUrqlClient = (pageProps: any) => {
  const urqlData = pageProps.URQL_DATA
  const { urqlClient } = useMemo(() => {
    return initUrqlClient(url, urqlData)
  }, [urqlData])
  return urqlClient
}
