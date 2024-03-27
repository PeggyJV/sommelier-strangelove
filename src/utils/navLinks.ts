// /Users/henriots/Desktop/sommelier-strangelove/src/utils/navLinks.ts
import { BRIDGE_PAGE_ENABLED } from "./constants"

interface NavLink {
  link: string
  title: string
  isNew?: boolean // Optional property to indicate new links
}

export const NAV_LINKS: NavLink[] = (() => {
  const links: NavLink[] = [
    {
      link: "/",
      title: "Vaults",
    },
    {
      link: "/bridge",
      title: "Bridge",
    },
    {
      link: "/snapshot",
      title: "Snapshot",
      isNew: true, // Directly set the isNew flag for Snapshot to true
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
