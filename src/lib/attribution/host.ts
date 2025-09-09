export function parseHostname(hostHeader: string | undefined) {
  if (!hostHeader) return ""
  // strips port if present (localhost:3000 -> localhost)
  return hostHeader.split(":")[0].trim().toLowerCase()
}

export function getAllowedSuffixes() {
  const raw = process.env.ATTRIBUTION_ALLOW_HOST_SUFFIXES || ""
  const list = raw
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)
  // Safe defaults for local/dev if none provided
  return list.length
    ? list
    : ["localhost", "127.0.0.1", "vercel.app", "somm.finance"]
}

export function isAllowedHost(hostHeader: string | undefined) {
  const host = parseHostname(hostHeader)
  if (!host) return false
  const suffixes = getAllowedSuffixes()
  return suffixes.some(
    (suf) => host === suf || host.endsWith(`.${suf}`)
  )
}
