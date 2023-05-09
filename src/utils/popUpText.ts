export const popUpText = (strategy: string) => {
  const isPopUpEnable =
    strategy === "Real Yield USD" ||
    strategy === "Real Yield ETH" ||
    strategy === "DeFi Stars"

  const isRealYield =
    strategy === "Real Yield USD" || strategy === "Real Yield ETH"

  const isDeFiStars = strategy === "DeFi Stars"

  if (isPopUpEnable) {
    if (isRealYield) {
      return {
        heading: "Get Exclusive Real Yield Updates",
        text: "Thank you for your trust. As a Real Yield vault user, you’re eligible for exclusive strategy updates directly from the strategist - 7 Seas. Delivered to your inbox every week. We’ll only use your email for this purpose.",
      }
    }
    if (isDeFiStars) {
      return {
        heading: "Get Exclusive DeFi Stars Updates",
        text: "Thank you for your trust. As a DeFi Stars vault user, you’re eligible for exclusive strategy updates directly from the strategist AlgoLab. Delivered to your inbox every week. We’ll only use your email for this purpose.",
      }
    } else {
      return {
        heading: "Get Notified",
        text: "Sign up for new strategy launch and other product  announcements—we’ll only use your email for this purpose.",
      }
    }
  } else {
    return false
  }
}
