import type { NextApiRequest, NextApiResponse } from "next"

const testGeo = (req: NextApiRequest, res: NextApiResponse) => {
  console.log({ headers: req.headers, rawHeaders: req.rawHeaders })
  const { headers } = req
  res.status(200).json({ headers })
}

export default testGeo
