import { BRIDGE_PAGE_ENABLED } from "./constants"

export const NAV_LINKS = (() => {
  const links = [
    {
      link: "/",
      title: "Vaults",
    },
    {
      link: "/snapshot",
      title: "Snapshot",
      isNew: false,
    },
    {
      link: "https://www.somm.finance/staking",
      title: "Staking",
    },
    {
      link: "https://www.somm.finance/defi",
      title: "DeFi",
    },
    {
      link: "/bridge",
      title: "Bridge",
    },
    {
      link: "https://www.somm.finance/audits",
      title: "Audits",
    },
  ]
  if (!BRIDGE_PAGE_ENABLED) {
    return links.filter((item) => item.title !== "Bridge")
  }
  return links
})()
