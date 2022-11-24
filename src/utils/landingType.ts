export const DIRECT = "Direct"

export const landingType = () => {
  const referrer = document.referrer
  if (referrer === "" || !referrer) {
    return DIRECT
  }
  return referrer
}
