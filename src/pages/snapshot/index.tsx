import { Page404 } from "components/_pages/Page404"
import { PageBridge } from "components/_pages/PageBridge"
import {
  configureGraz,
  GrazChain,
  GrazProvider,
  mainnetChains,
} from "graz"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { BRIDGE_PAGE_ENABLED } from "utils/constants"
import { origin } from "utils/origin"
const chain: GrazChain = {
  ...mainnetChains.sommelier,
  rpc: "https://sommelier-rpc.polkachu.com/",
  rest: "https://sommelier-api.polkachu.com/",
}
