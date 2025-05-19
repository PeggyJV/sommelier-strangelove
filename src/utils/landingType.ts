export const DIRECT = "Direct"

export const landingType = () => {
  if (typeof window === "undefined") {
    return DIRECT
  }

  const referrer = document.referrer
  if (referrer === "" || !referrer) {
    return DIRECT
  }
  return referrer
}
