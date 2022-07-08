import path from "path"
import { NextApiRequest, NextApiResponse } from "next"
import maxmind, { Reader, CityResponse } from "maxmind"

const maxmindPath = path.resolve(
  process.cwd(),
  "maxmind/GeoLite2-City.mmdb"
)
const loadMaxmind = new Promise<Reader<CityResponse>>((resolve) =>
  maxmind.open<CityResponse>(maxmindPath).then((fn) => {
    resolve(fn)
  })
)

const unknownResponse = {
  isRestricted: false,
  country: "NO_RESULT",
}

export default async function getGeo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const forwardedFor = req.headers["x-forwarded-for"]

  function replyUnknown() {
    return res.status(200).json(unknownResponse)
  }

  if (forwardedFor == null || forwardedFor.length === 0) {
    return replyUnknown()
  }

  let ip = forwardedFor
  if (Array.isArray(ip)) {
    ip = ip[0]
  }

  const lookup = await loadMaxmind
  const geo = lookup.get(ip)

  if (geo == null || geo.country == null) {
    return replyUnknown()
  }

  const country = geo.country

  return res.status(200).json({
    isRestricted: isRestricted(geo),
    country: country.iso_code,
  })
}

// https://orpa.princeton.edu/export-controls/sanctioned-countries
// Updated as of March 10, 2022
const restricted = new Map<string, Set<string>>()
restricted.set("CU", new Set(["*"])) // Cuba
restricted.set("IR", new Set(["*"])) // Iran
restricted.set("KP", new Set(["*"])) // North Korea
restricted.set("RU", new Set(["*"])) // Russia
restricted.set("SY", new Set(["*"])) // Syria
restricted.set("UA", new Set(["43", "14", "09"])) // Ukraine: Crimea, Donetsk, Luhansk

// Restricted countries
restricted.set("US", new Set(["*"])) // United States

function isRestricted(geo: CityResponse) {
  if (geo.country == null) {
    throw new Error("Missing Country information")
  }

  const countryCode = geo.country.iso_code
  const restrictedRegions = restricted.get(countryCode)

  // Not on restricted list
  if (restrictedRegions == null) {
    return false
  }

  // All regions are restricted
  if (restrictedRegions.has("*")) {
    return true
  }

  // Country has restricted regions but we could not detect their region
  if (geo.subdivisions == null) {
    return false
  }

  // Check all detected subdivisions against restricted region list
  for (const region of geo.subdivisions) {
    if (restrictedRegions.has(region.iso_code)) {
      return true
    }
  }

  return false
}
