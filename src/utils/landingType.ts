export const landingType = () => {
  const referrer = document.referrer
  if (referrer === "" || !referrer) {
    return "Direct"
  }
  return referrer
}
