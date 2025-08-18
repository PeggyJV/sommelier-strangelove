import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, value, id, page, userAgent } = req.body

  // Log Web Vitals to console for development
  console.log('Web Vitals:', {
    name,
    value,
    id,
    page,
    userAgent,
    timestamp: new Date().toISOString()
  })

  // TODO: Send to analytics service if keys are present
  // if (process.env.POSTHOG_KEY) {
  //   // Send to PostHog
  // } else if (process.env.GA_MEASUREMENT_ID) {
  //   // Send to Google Analytics
  // }

  res.status(200).json({ success: true })
}
