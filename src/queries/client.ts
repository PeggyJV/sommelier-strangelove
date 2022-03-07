import { createClient } from 'urql'

export const client = createClient({
  // TODO: Pull this from config / env
  url: 'https://api.thegraph.com/subgraphs/name/elkdao/cellars' // subject to change
})
