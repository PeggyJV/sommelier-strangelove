import { BRIDGE_PAGE_ENABLED } from "./constants"

export const NAV_LINKS = (() => {
  const links = [
    {
      link: "/",
      title: "Vaults",
    },
    {
      link: "https://www.sommelier.finance/staking",
      title: "Staking",
    },
    {
      link: "https://www.sommelier.finance/defi",
      title: "DeFi",
    },
    {
      link: "/bridge",
      title: "Bridge",
    },
    {
      link: "https://www.sommelier.finance/audits",
      title: "Audits",
    },
  ]
  if (!BRIDGE_PAGE_ENABLED) {
    return links.filter((item) => item.title !== "Bridge")
  }
  return links
})()
