import { Page404 } from "components/_pages/Page404"
import { PageBridge } from "components/_pages/PageBridge"
import type { NextPage } from "next"
import { BRIDGE_PAGE_ENABLED } from "utils/constants"

const Bridge: NextPage = () => {
  return BRIDGE_PAGE_ENABLED ? <PageBridge /> : <Page404 />
}

export default Bridge
