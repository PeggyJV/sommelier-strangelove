import {
  createClient,
  ssrExchange,
  dedupExchange,
  cacheExchange,
  fetchExchange
} from 'urql'

const url = 'https://api.thegraph.com/subgraphs/name/elkdao/cellars' // subject to change

export const client = createClient({
  // TODO: Pull this from config / env
  url
})

const ssrCache = ssrExchange({ isClient: false })

export const ssrClient = createClient({
  url,
  exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
})
