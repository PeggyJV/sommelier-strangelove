import { BRIDGE_PAGE_ENABLED } from "./constants"

type NavLink = {
  link: string
  title: string
  isNew?: boolean
}

export const NAV_LINKS = (() => {
  const links: NavLink[] = [
    {
      link: "/",
      title: "Vaults",
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
