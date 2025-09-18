/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http'
import handler from '../pages/api/privacy/data-retention'
import { privacyPipeline, DataClassification, ComplianceFramework } from '../utils/privacy-pipeline'
import { enhancedAttribution, AttributionModel } from '../utils/attribution-enhanced'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_PRIVACY_ENABLED: 'true',
    EVENTS_SALT: 'test-salt',
  }
})

afterEach(() => {
  process.env = originalEnv
})

describe('Privacy Pipeline', () => {
  it('should hash sensitive data correctly', () => {
    const testData = '0x1234567890123456789012345678901234567890'
    const hashed = privacyPipeline.hashSensitiveData(testData)
    
    expect(hashed).toBeDefined()
    expect(hashed).toHaveLength(64) // SHA-256 hex length
    expect(hashed).not.toBe(testData)
  })

  it('should record data processing activities', () => {
    const dataId = 'test-data-123'
    const dataSubjectId = 'user-123'
    
    privacyPipeline.recordDataProcessing(
      dataId,
      DataClassification.CONFIDENTIAL,
      'analytics tracking',
      dataSubjectId,
      ['user_behavior', 'device_info'],
      [ComplianceFramework.GDPR]
    )
    
    const shouldRetain = privacyPipeline.shouldRetainData(dataId)
    expect(shouldRetain).toBe(true)
  })

  it('should handle data deletion requests', () => {
    const dataSubjectId = 'user-123'
    const requestId = privacyPipeline.requestDataDeletion(dataSubjectId, 'erasure')
    
    expect(requestId).toBeDefined()
    expect(typeof requestId).toBe('string')
  })

  it('should generate compliance reports', () => {
    const report = privacyPipeline.getComplianceReport()
    
    expect(report).toHaveProperty('framework_compliance')
    expect(report).toHaveProperty('data_retention_compliance')
    expect(report).toHaveProperty('consent_compliance')
    expect(report).toHaveProperty('deletion_requests_processed')
  })
})

describe('Enhanced Attribution', () => {
  it('should parse UTM parameters correctly', () => {
    const testUrl = 'https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=test'
    const parsed = enhancedAttribution.parseUTMParameters(testUrl)
    
    expect(parsed.utm_source).toBe('google')
    expect(parsed.utm_medium).toBe('cpc')
    expect(parsed.utm_campaign).toBe('test')
  })

  it('should detect device types correctly', () => {
    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    
    expect(enhancedAttribution.detectDeviceType(mobileUA)).toBe('mobile')
    expect(enhancedAttribution.detectDeviceType(desktopUA)).toBe('desktop')
  })

  it('should create and update attribution data', () => {
    const sessionId = 'test-session-123'
    const utmParams = {
      utm_source: 'google',
      utm_medium: 'cpc',
    }
    
    const attribution = enhancedAttribution.createOrUpdateAttribution(
      sessionId,
      utmParams,
      'https://google.com',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    )
    
    expect(attribution.session_id).toBe(sessionId)
    expect(attribution.utm_source).toBe('google')
    expect(attribution.device_type).toBe('desktop')
    expect(attribution.first_visit).toBe(true)
  })

  it('should track conversions', () => {
    const sessionId = 'test-session-123'
    const success = enhancedAttribution.trackConversion(
      sessionId,
      'deposit_completed',
      100,
      { token: 'USDC', amount: '1000' }
    )
    
    expect(success).toBe(true)
    
    const attribution = enhancedAttribution.getAttribution(sessionId)
    expect(attribution?.conversions).toHaveLength(1)
    expect(attribution?.conversion_value).toBe(100)
  })

  it('should calculate attribution credits', () => {
    const sessionId = 'test-session-123'
    
    // Create attribution with conversion
    enhancedAttribution.createOrUpdateAttribution(
      sessionId,
      { utm_source: 'google' },
      'https://google.com'
    )
    
    enhancedAttribution.trackConversion(sessionId, 'deposit_completed', 100)
    
    const credits = enhancedAttribution.calculateAttributionCredit(
      sessionId,
      AttributionModel.LAST_CLICK
    )
    
    expect(credits.google).toBe(100)
  })

  it('should generate attribution reports', () => {
    const report = enhancedAttribution.generateAttributionReport()
    
    expect(report).toHaveProperty('total_sessions')
    expect(report).toHaveProperty('conversions')
    expect(report).toHaveProperty('conversion_rate')
    expect(report).toHaveProperty('top_sources')
    expect(report).toHaveProperty('attribution_model_performance')
  })
})

describe('/api/privacy/data-retention', () => {
  it('should reject non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      operation: 'GET',
      error: 'Method not allowed'
    })
  })

  it('should handle cleanup operation', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        operation: 'cleanup',
        max_age: 30 * 24 * 60 * 60 * 1000 // 30 days
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const response = JSON.parse(res._getData())
    expect(response.success).toBe(true)
    expect(response.operation).toBe('cleanup')
    expect(response.results).toHaveProperty('privacy_data_cleaned')
    expect(response.results).toHaveProperty('attribution_data_cleaned')
  })

  it('should handle audit operation', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        operation: 'audit'
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const response = JSON.parse(res._getData())
    expect(response.success).toBe(true)
    expect(response.operation).toBe('audit')
    expect(response.results).toHaveProperty('data_processing_audit')
    expect(response.results).toHaveProperty('compliance_report')
  })

  it('should handle data deletion request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        operation: 'delete',
        data_subject_id: 'user-123',
        request_type: 'erasure'
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const response = JSON.parse(res._getData())
    expect(response.success).toBe(true)
    expect(response.operation).toBe('delete')
    expect(response.results).toHaveProperty('request_id')
    expect(response.results.data_subject_id).toBe('user-123')
  })

  it('should handle data export request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        operation: 'export',
        data_subject_id: 'user-123'
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const response = JSON.parse(res._getData())
    expect(response.success).toBe(true)
    expect(response.operation).toBe('export')
    expect(response.results).toHaveProperty('export_data')
  })

  it('should return error for invalid operation', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        operation: 'invalid_operation'
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const response = JSON.parse(res._getData())
    expect(response.success).toBe(false)
    expect(response.error).toContain('Invalid operation')
  })

  it('should return success when privacy is disabled', async () => {
    process.env.NEXT_PUBLIC_PRIVACY_ENABLED = 'false'
    
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        operation: 'cleanup'
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const response = JSON.parse(res._getData())
    expect(response.success).toBe(true)
    expect(response.operation).toBe('privacy_disabled')
  })
})
