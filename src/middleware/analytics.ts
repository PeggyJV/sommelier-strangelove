/*
  Analytics middleware for UTM attribution tracking
  Captures UTM parameters and sets first-party cookie for attribution
*/

import { NextRequest, NextResponse } from 'next/server'

// Cookie configuration
const ATTRIBUTION_COOKIE = 'somm_attrib'
const COOKIE_TTL_DAYS = 30
const COOKIE_TTL_MS = COOKIE_TTL_DAYS * 24 * 60 * 60 * 1000

interface AttributionData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  referrer?: string
  timestamp: number
  session_id: string
}

export function analyticsMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Check if analytics is enabled
  const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
  if (!analyticsEnabled) {
    return response
  }

  // Get existing attribution data
  const existingAttrib = getAttributionFromCookie(request)
  
  // Check for UTM parameters in URL
  const utmParams = getUTMParams(request)
  const hasUTMParams = Object.keys(utmParams).length > 0
  
  // Get referrer
  const referrer = request.headers.get('referer') || request.headers.get('referrer')
  
  // Only update attribution if we have new UTM parameters or no existing attribution
  if (hasUTMParams || !existingAttrib) {
    const attributionData: AttributionData = {
      ...existingAttrib,
      ...utmParams,
      timestamp: Date.now(),
      session_id: existingAttrib?.session_id || generateSessionId(),
    }

    // Add referrer if present and not already set
    if (referrer && !existingAttrib?.referrer) {
      attributionData.referrer = referrer
    }

    // Set attribution cookie
    setAttributionCookie(response, attributionData)
  }

  return response
}

function getUTMParams(request: NextRequest): Partial<AttributionData> {
  const url = new URL(request.url)
  const params: Partial<AttributionData> = {}

  // Extract UTM parameters
  const utmSource = url.searchParams.get('utm_source')
  const utmMedium = url.searchParams.get('utm_medium')
  const utmCampaign = url.searchParams.get('utm_campaign')
  const utmContent = url.searchParams.get('utm_content')
  const utmTerm = url.searchParams.get('utm_term')

  if (utmSource) params.utm_source = utmSource
  if (utmMedium) params.utm_medium = utmMedium
  if (utmCampaign) params.utm_campaign = utmCampaign
  if (utmContent) params.utm_content = utmContent
  if (utmTerm) params.utm_term = utmTerm

  return params
}

function getAttributionFromCookie(request: NextRequest): AttributionData | null {
  try {
    const cookieValue = request.cookies.get(ATTRIBUTION_COOKIE)?.value
    if (!cookieValue) return null

    const decoded = decodeURIComponent(cookieValue)
    const data = JSON.parse(decoded)

    // Check if cookie is expired
    const age = Date.now() - data.timestamp
    if (age > COOKIE_TTL_MS) {
      return null
    }

    return data
  } catch {
    return null
  }
}

function setAttributionCookie(response: NextResponse, data: AttributionData) {
  const cookieValue = encodeURIComponent(JSON.stringify(data))
  
  response.cookies.set(ATTRIBUTION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_TTL_MS / 1000, // Convert to seconds
    path: '/',
  })
}

function generateSessionId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Export for use in Next.js middleware
export default function middleware(request: NextRequest) {
  return analyticsMiddleware(request)
}

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
