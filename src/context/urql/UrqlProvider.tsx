import React, { ReactNode } from "react"
import { Provider } from "urql"
import { useUrqlClient } from "./useUrqlClient"
type Props = {
  children: ReactNode
  pageProps: any
}
const UrqlProvider = ({ children, pageProps }: Props) => {
  const client = useUrqlClient(pageProps)
  return <Provider value={client}>{children}</Provider>
}
export default UrqlProvider
