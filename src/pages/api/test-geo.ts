import type { NextApiRequest, NextApiResponse } from "next"

const testGeo = (req: NextApiRequest, res: NextApiResponse) => {
  const { headers } = req
  const region = headers["x-vercel-ip-country"] as string | undefined

  res.status(200).json({ region })
}

export default testGeo
