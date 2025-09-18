/*
  Server-side analytics event collection endpoint
  Collects events from client and enriches with server-side data
  Supports privacy-compliant wallet address hashing and attribution
*/

import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

// Environment configuration
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
const EVENTS_SALT = process.env.EVENTS_SALT || 'default-salt-change-in-production'
const PRODUCT_ANALYTICS_WRITE_KEY = process.env.PRODUCT_ANALYTICS_WRITE_KEY

// Event schema validation
interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
  session_id?: string
  user_id?: string
}

interface EnrichedEvent extends AnalyticsEvent {
  // Server-side enrichment
  server_timestamp: number
  ip_hash?: string
  user_agent_hash?: string
  wallet_hash?: string
  build_id?: string
  attribution?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    referrer?: string
  }
}

// Hash function for privacy-compliant data
function hashData(data: string, salt: string): string {
  return crypto.createHash('sha256').update(data + salt).digest('hex')
}

// Extract IP address from request
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const realIP = req.headers['x-real-ip']
  
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]
  }
  
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP
  }
  
  return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown'
}

// Extract attribution from cookies
function getAttribution(req: NextApiRequest) {
  const cookies = req.headers.cookie
  if (!cookies) return {}
  
  const sommAttribMatch = cookies.match(/somm_attrib=([^;]+)/)
  if (!sommAttribMatch) return {}
  
  try {
    const decoded = decodeURIComponent(sommAttribMatch[1])
    return JSON.parse(decoded)
  } catch {
    return {}
  }
}

// Validate event schema
function validateEvent(event: any): event is AnalyticsEvent {
  if (!event || typeof event !== 'object') return false
  if (!event.event || typeof event.event !== 'string') return false
  if (event.properties && typeof event.properties !== 'object') return false
  if (event.timestamp && typeof event.timestamp !== 'number') return false
  return true
}

// Enrich event with server-side data
function enrichEvent(event: AnalyticsEvent, req: NextApiRequest): EnrichedEvent {
  const enriched: EnrichedEvent = {
    ...event,
    server_timestamp: Date.now(),
    build_id: process.env.NEXT_PUBLIC_BUILD_ID,
    attribution: getAttribution(req),
  }

  // Hash sensitive data for privacy
  const ip = getClientIP(req)
  if (ip && ip !== 'unknown') {
    enriched.ip_hash = hashData(ip, EVENTS_SALT)
  }

  const userAgent = req.headers['user-agent']
  if (userAgent) {
    enriched.user_agent_hash = hashData(userAgent, EVENTS_SALT)
  }

  // Hash wallet address if present
  if (event.properties?.wallet_address) {
    enriched.wallet_hash = hashData(event.properties.wallet_address, EVENTS_SALT)
    // Remove plaintext wallet address
    delete enriched.properties?.wallet_address
  }

  return enriched
}

// Forward event to analytics service (placeholder)
async function forwardEvent(event: EnrichedEvent) {
  if (!PRODUCT_ANALYTICS_WRITE_KEY) {
    console.log('Analytics: No write key configured, event logged locally:', event.event)
    return
  }

  // TODO: Implement forwarding to PostHog, Mixpanel, or GA4
  // This is a placeholder for the actual implementation
  console.log('Analytics: Event would be forwarded:', event.event, event.properties)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if analytics is enabled
  if (!ANALYTICS_ENABLED) {
    return res.status(200).json({ success: true, message: 'Analytics disabled' })
  }

  try {
    // Parse and validate event
    const event = req.body
    if (!validateEvent(event)) {
      return res.status(400).json({ error: 'Invalid event format' })
    }

    // Enrich event with server-side data
    const enrichedEvent = enrichEvent(event, req)

    // Forward to analytics service
    await forwardEvent(enrichedEvent)

    // Log for debugging (remove in production)
    console.log('Analytics event collected:', {
      event: enrichedEvent.event,
      properties: enrichedEvent.properties,
      timestamp: enrichedEvent.server_timestamp,
    })

    return res.status(200).json({ 
      success: true, 
      event_id: enrichedEvent.server_timestamp,
      message: 'Event collected successfully' 
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process analytics event'
    })
  }
}

// Disable body parsing for this endpoint (we'll handle it manually)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
