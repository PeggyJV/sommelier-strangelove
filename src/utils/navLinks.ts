import { BRIDGE_PAGE_ENABLED } from "./constants"

export const NAV_LINKS = (() => {
  const links = [
    {
      link: "/",
      title: "Vaults",
    },
    {
      link: "/bridge",
      title: "Bridge",
    },
    {
      link: "/snapshots",
      title: "Snapshots",
    },
    {
      link: "https://www.sommelier.finance/",
      title: "About",
    },
    {
      link: "https://www.sommelier.finance/audits",
      title: "Audits",
    },
    {
      link: "https://www.sommelier.finance/staking",
      title: "Staking",
    },
    {
      link: "https://www.sommelier.finance/ecosystem",
      title: "Ecosystem",
    },
  ]
  if (!BRIDGE_PAGE_ENABLED) {
    return links.filter((item) => item.title !== "Bridge")
  }
  return links
})()
