/*
  Enhanced attribution system with advanced tracking features
  Provides comprehensive attribution data collection and analysis
*/

import crypto from 'crypto'

// Attribution data structure
export interface AttributionData {
  // UTM parameters
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  
  // Referrer information
  referrer?: string
  referrer_domain?: string
  
  // Session information
  session_id: string
  first_visit: boolean
  visit_count: number
  
  // Device and browser information
  user_agent?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
  browser?: string
  os?: string
  
  // Geographic information (if available)
  country?: string
  region?: string
  city?: string
  
  // Custom tracking parameters
  custom_params?: Record<string, string>
  
  // Timestamps
  first_seen: number
  last_seen: number
  session_start: number
  
  // Conversion tracking
  conversions: ConversionEvent[]
  conversion_value: number
  
  // Attribution model
  attribution_model: AttributionModel
}

export interface ConversionEvent {
  event_type: string
  timestamp: number
  value?: number
  properties?: Record<string, any>
}

export enum AttributionModel {
  FIRST_CLICK = 'first_click',
  LAST_CLICK = 'last_click',
  LINEAR = 'linear',
  TIME_DECAY = 'time_decay',
  POSITION_BASED = 'position_based',
}

export interface AttributionWindow {
  click_window: number // days
  view_window: number // days
  conversion_window: number // days
}

class EnhancedAttribution {
  private attributionData: Map<string, AttributionData> = new Map()
  private salt: string
  private defaultWindow: AttributionWindow = {
    click_window: 30,
    view_window: 1,
    conversion_window: 90,
  }

  constructor(salt: string) {
    this.salt = salt
  }

  // Generate unique session ID
  generateSessionId(): string {
    return crypto.randomBytes(16).toString('hex') + Date.now().toString(36)
  }

  // Parse UTM parameters from URL
  parseUTMParameters(url: string): Partial<AttributionData> {
    try {
      const urlObj = new URL(url)
      const params: Partial<AttributionData> = {}
      
      // Extract UTM parameters
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      utmParams.forEach(param => {
        const value = urlObj.searchParams.get(param)
        if (value) {
          params[param as keyof AttributionData] = value
        }
      })
      
      // Extract custom parameters (prefixed with 'ct_')
      const customParams: Record<string, string> = {}
      urlObj.searchParams.forEach((value, key) => {
        if (key.startsWith('ct_')) {
          customParams[key] = value
        }
      })
      
      if (Object.keys(customParams).length > 0) {
        params.custom_params = customParams
      }
      
      return params
    } catch {
      return {}
    }
  }

  // Extract referrer information
  parseReferrer(referrer?: string): { referrer?: string; referrer_domain?: string } {
    if (!referrer) return {}
    
    try {
      const referrerUrl = new URL(referrer)
      return {
        referrer,
        referrer_domain: referrerUrl.hostname,
      }
    } catch {
      return { referrer }
    }
  }

  // Detect device type from user agent
  detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    const tabletRegex = /iPad|Android(?=.*Tablet)|Kindle|Silk/i
    
    if (tabletRegex.test(userAgent)) return 'tablet'
    if (mobileRegex.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  // Extract browser information from user agent
  extractBrowserInfo(userAgent: string): { browser?: string; os?: string } {
    const browsers = [
      { name: 'Chrome', regex: /Chrome\/(\d+)/ },
      { name: 'Firefox', regex: /Firefox\/(\d+)/ },
      { name: 'Safari', regex: /Safari\/(\d+)/ },
      { name: 'Edge', regex: /Edg\/(\d+)/ },
      { name: 'Opera', regex: /Opera\/(\d+)/ },
    ]
    
    const os = [
      { name: 'Windows', regex: /Windows NT (\d+\.\d+)/ },
      { name: 'macOS', regex: /Mac OS X (\d+[._]\d+)/ },
      { name: 'Linux', regex: /Linux/ },
      { name: 'iOS', regex: /OS (\d+[._]\d+)/ },
      { name: 'Android', regex: /Android (\d+\.\d+)/ },
    ]
    
    const browser = browsers.find(b => b.regex.test(userAgent))?.name
    const operatingSystem = os.find(o => o.regex.test(userAgent))?.name
    
    return { browser, os: operatingSystem }
  }

  // Create or update attribution data
  createOrUpdateAttribution(
    sessionId: string,
    utmParams: Partial<AttributionData>,
    referrer?: string,
    userAgent?: string
  ): AttributionData {
    const existing = this.attributionData.get(sessionId)
    const now = Date.now()
    
    if (existing) {
      // Update existing attribution
      existing.last_seen = now
      existing.visit_count++
      
      // Update referrer if new one provided
      if (referrer && referrer !== existing.referrer) {
        const referrerInfo = this.parseReferrer(referrer)
        Object.assign(existing, referrerInfo)
      }
      
      return existing
    }
    
    // Create new attribution data
    const referrerInfo = this.parseReferrer(referrer)
    const deviceInfo = userAgent ? {
      user_agent: userAgent,
      device_type: this.detectDeviceType(userAgent),
      ...this.extractBrowserInfo(userAgent),
    } : {}
    
    const attribution: AttributionData = {
      session_id: sessionId,
      first_visit: true,
      visit_count: 1,
      first_seen: now,
      last_seen: now,
      session_start: now,
      conversions: [],
      conversion_value: 0,
      attribution_model: AttributionModel.LAST_CLICK,
      ...utmParams,
      ...referrerInfo,
      ...deviceInfo,
    }
    
    this.attributionData.set(sessionId, attribution)
    return attribution
  }

  // Track conversion event
  trackConversion(
    sessionId: string,
    eventType: string,
    value?: number,
    properties?: Record<string, any>
  ): boolean {
    const attribution = this.attributionData.get(sessionId)
    if (!attribution) return false
    
    const conversion: ConversionEvent = {
      event_type: eventType,
      timestamp: Date.now(),
      value,
      properties,
    }
    
    attribution.conversions.push(conversion)
    if (value) {
      attribution.conversion_value += value
    }
    
    return true
  }

  // Get attribution data for session
  getAttribution(sessionId: string): AttributionData | undefined {
    return this.attributionData.get(sessionId)
  }

  // Calculate attribution credit using different models
  calculateAttributionCredit(
    sessionId: string,
    model: AttributionModel = AttributionModel.LAST_CLICK
  ): Record<string, number> {
    const attribution = this.attributionData.get(sessionId)
    if (!attribution || attribution.conversions.length === 0) {
      return {}
    }
    
    const credits: Record<string, number> = {}
    const totalValue = attribution.conversion_value
    
    switch (model) {
      case AttributionModel.FIRST_CLICK:
        credits[attribution.utm_source || 'direct'] = totalValue
        break
        
      case AttributionModel.LAST_CLICK:
        credits[attribution.utm_source || 'direct'] = totalValue
        break
        
      case AttributionModel.LINEAR:
        const touchpoints = this.getTouchpoints(sessionId)
        const creditPerTouchpoint = totalValue / touchpoints.length
        touchpoints.forEach(touchpoint => {
          credits[touchpoint.source] = (credits[touchpoint.source] || 0) + creditPerTouchpoint
        })
        break
        
      case AttributionModel.TIME_DECAY:
        const decayTouchpoints = this.getTouchpoints(sessionId)
        const totalWeight = decayTouchpoints.reduce((sum, tp) => sum + tp.weight, 0)
        decayTouchpoints.forEach(touchpoint => {
          credits[touchpoint.source] = (credits[touchpoint.source] || 0) + 
            (totalValue * touchpoint.weight / totalWeight)
        })
        break
        
      case AttributionModel.POSITION_BASED:
        const positionTouchpoints = this.getTouchpoints(sessionId)
        if (positionTouchpoints.length === 1) {
          credits[positionTouchpoints[0].source] = totalValue
        } else if (positionTouchpoints.length === 2) {
          credits[positionTouchpoints[0].source] = totalValue * 0.4
          credits[positionTouchpoints[1].source] = totalValue * 0.4
        } else {
          const firstLastCredit = totalValue * 0.4
          const middleCredit = totalValue * 0.2 / (positionTouchpoints.length - 2)
          
          credits[positionTouchpoints[0].source] = firstLastCredit
          credits[positionTouchpoints[positionTouchpoints.length - 1].source] = firstLastCredit
          
          for (let i = 1; i < positionTouchpoints.length - 1; i++) {
            credits[positionTouchpoints[i].source] = (credits[positionTouchpoints[i].source] || 0) + middleCredit
          }
        }
        break
    }
    
    return credits
  }

  // Get touchpoints for attribution analysis
  private getTouchpoints(sessionId: string): Array<{ source: string; timestamp: number; weight: number }> {
    const attribution = this.attributionData.get(sessionId)
    if (!attribution) return []
    
    const touchpoints = []
    const now = Date.now()
    
    // Add UTM source if present
    if (attribution.utm_source) {
      const age = now - attribution.first_seen
      const weight = Math.exp(-age / (7 * 24 * 60 * 60 * 1000)) // 7-day half-life
      touchpoints.push({
        source: attribution.utm_source,
        timestamp: attribution.first_seen,
        weight,
      })
    }
    
    // Add referrer if present and different from UTM source
    if (attribution.referrer_domain && attribution.referrer_domain !== attribution.utm_source) {
      const age = now - attribution.first_seen
      const weight = Math.exp(-age / (7 * 24 * 60 * 60 * 1000))
      touchpoints.push({
        source: attribution.referrer_domain,
        timestamp: attribution.first_seen,
        weight,
      })
    }
    
    return touchpoints.sort((a, b) => a.timestamp - b.timestamp)
  }

  // Generate attribution report
  generateAttributionReport(): {
    total_sessions: number
    conversions: number
    conversion_rate: number
    top_sources: Array<{ source: string; sessions: number; conversions: number; value: number }>
    attribution_model_performance: Record<AttributionModel, Record<string, number>>
  } {
    const sessions = Array.from(this.attributionData.values())
    const totalSessions = sessions.length
    const conversions = sessions.filter(s => s.conversions.length > 0).length
    const conversionRate = totalSessions > 0 ? conversions / totalSessions : 0
    
    // Calculate top sources
    const sourceStats: Record<string, { sessions: number; conversions: number; value: number }> = {}
    
    sessions.forEach(session => {
      const source = session.utm_source || session.referrer_domain || 'direct'
      if (!sourceStats[source]) {
        sourceStats[source] = { sessions: 0, conversions: 0, value: 0 }
      }
      
      sourceStats[source].sessions++
      if (session.conversions.length > 0) {
        sourceStats[source].conversions++
        sourceStats[source].value += session.conversion_value
      }
    })
    
    const topSources = Object.entries(sourceStats)
      .map(([source, stats]) => ({ source, ...stats }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
    
    // Calculate attribution model performance
    const attributionModelPerformance: Record<AttributionModel, Record<string, number>> = {
      [AttributionModel.FIRST_CLICK]: {},
      [AttributionModel.LAST_CLICK]: {},
      [AttributionModel.LINEAR]: {},
      [AttributionModel.TIME_DECAY]: {},
      [AttributionModel.POSITION_BASED]: {},
    }
    
    Object.values(AttributionModel).forEach(model => {
      sessions.forEach(session => {
        const credits = this.calculateAttributionCredit(session.session_id, model)
        Object.entries(credits).forEach(([source, credit]) => {
          attributionModelPerformance[model][source] = 
            (attributionModelPerformance[model][source] || 0) + credit
        })
      })
    })
    
    return {
      total_sessions: totalSessions,
      conversions,
      conversion_rate: conversionRate,
      top_sources: topSources,
      attribution_model_performance: attributionModelPerformance,
    }
  }

  // Clean up old attribution data
  cleanupOldData(maxAge: number = 90 * 24 * 60 * 60 * 1000): number {
    let cleanedCount = 0
    const cutoffTime = Date.now() - maxAge
    
    for (const [sessionId, attribution] of this.attributionData.entries()) {
      if (attribution.last_seen < cutoffTime) {
        this.attributionData.delete(sessionId)
        cleanedCount++
      }
    }
    
    return cleanedCount
  }
}

// Export singleton instance
export const enhancedAttribution = new EnhancedAttribution(
  process.env.EVENTS_SALT || 'default-salt-change-in-production'
)

// Export types for use in components
export type { AttributionData, ConversionEvent }
