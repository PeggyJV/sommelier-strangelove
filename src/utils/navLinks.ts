import { BRIDGE_PAGE_ENABLED } from "./constants"

export const NAV_LINKS = (() => {
  const links = [
    {
      link: "https://www.sommelier.finance/",
      title: "About",
    },
    {
      link: "/bridge",
      title: "Bridge",
    },
  ]
  if (!BRIDGE_PAGE_ENABLED) {
    return links.filter((item) => item.title !== "Bridge")
  }
  return links
})()
