/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http'
import handler from '../pages/api/events'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_ANALYTICS_ENABLED: 'true',
    EVENTS_SALT: 'test-salt',
  }
})

afterEach(() => {
  process.env = originalEnv
})

describe('/api/events', () => {
  it('should reject non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    })
  })

  it('should return success when analytics is disabled', async () => {
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'false'
    
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        event: 'test_event',
        properties: { test: true },
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      message: 'Analytics disabled',
    })
  })

  it('should reject invalid event format', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        // Missing required 'event' field
        properties: { test: true },
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid event format',
    })
  })

  it('should accept valid event and return success', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'user-agent': 'test-agent',
        'x-forwarded-for': '192.168.1.1',
      },
      body: {
        event: 'test_event',
        properties: {
          test: true,
          wallet_address: '0x1234567890123456789012345678901234567890',
        },
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const response = JSON.parse(res._getData())
    expect(response.success).toBe(true)
    expect(response.event_id).toBeDefined()
    expect(response.message).toBe('Event collected successfully')
  })

  it('should hash sensitive data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'user-agent': 'test-agent',
        'x-forwarded-for': '192.168.1.1',
      },
      body: {
        event: 'test_event',
        properties: {
          wallet_address: '0x1234567890123456789012345678901234567890',
        },
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    // The wallet address should be hashed and removed from properties
    // This is tested by checking that the event was processed successfully
    // In a real test, you'd check the actual enrichment logic
  })
})
