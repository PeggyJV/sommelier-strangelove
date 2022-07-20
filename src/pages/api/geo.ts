import type { NextApiRequest, NextApiResponse } from "next"

const testGeo = (req: NextApiRequest, res: NextApiResponse) => {
  const { headers } = req
  console.log({ headers })

  if (process.env.NODE_ENV === "development") {
    headers["x-vercel-ip-country"] = process.env.IP_COUNTRY || "UA"
    headers["x-vercel-ip-country-region"] =
      process.env.IP_COUNTRY_REGION || "14"
  }

  let country = headers["x-vercel-ip-country"] ?? "NO_RESULT"
  let region = headers["x-vercel-ip-country-region"] ?? "NO_RESULT"

  if (Array.isArray(country)) {
    country = country[0]
  }
  if (Array.isArray(region)) {
    region = region[0]
  }

  const isRestricted = (country: string, region: string): boolean => {
    // https://orpa.princeton.edu/export-controls/sanctioned-countries
    // Updated as of March 10, 2022
    const restricted: { [key: string]: string[] } = {
      US: ["*"], // USA
      CU: ["*"], // Cuba
      IR: ["*"], // Iran
      KP: ["*"], // North Korea
      RU: ["*"], // Russia
      SY: ["*"], // Syria
      UA: ["43", "14", "09"], // Ukraine: Crimea, Donetsk, Luhansk
    }

    const restrictedRegions = restricted[country] ?? null
    const restrictedKeys = Object.keys(restricted)

    // Not on restricted list
    if (restrictedRegions === null) {
      return false
    }

    // All regions are restricted
    if (
      restrictedRegions.includes("*") ||
      restrictedRegions.includes(region)
    ) {
      return true
    }

    // // Country has restricted regions but we could not detect their region
    // if (restrictedKeys.filter((val) => val === country)) {
    //   return false
    // }

    return false
  }

  res.status(200).json({
    country,
    region,
    isRestricted: isRestricted(country, region),
  })
}

export default testGeo
