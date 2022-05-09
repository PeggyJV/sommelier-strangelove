import {
  createClient,
  ssrExchange,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from "urql"

const url = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT!

export const client = createClient({ url })

const ssrCache = ssrExchange({ isClient: false })

export const ssrClient = createClient({
  url,
  exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
})
