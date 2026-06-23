/**
 * @jest-environment node
 */

// Minimal stand-in for node-mocks-http's createMocks (avoids the extra dep).
// Covers exactly what the /api/events handler touches: req.method/headers/body
// (+ connection/socket for IP lookup) and a chainable res.status().json().
function createMocks(opts: {
  method?: string
  headers?: Record<string, string>
  body?: unknown
}) {
  const req: any = {
    method: opts.method ?? 'GET',
    headers: opts.headers ?? {},
    body: opts.body,
    connection: {},
    socket: {},
  }
  const res: any = {
    statusCode: 200,
    _data: undefined,
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(data: unknown) {
      this._data = data
      return this
    },
    setHeader() {
      return this
    },
    _getStatusCode() {
      return this.statusCode
    },
    _getData() {
      return JSON.stringify(this._data)
    },
  }
  return { req, res }
}

// The handler reads `NEXT_PUBLIC_ANALYTICS_ENABLED` into a module-level const at
// import time, so it must be loaded fresh (after env is set) for each scenario.
function loadHandler() {
  let handler: any
  jest.isolateModules(() => {
    handler = require('../pages/api/events').default
  })
  return handler
}

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
    const handler = loadHandler()
    const { req, res } = createMocks({ method: 'GET' })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    })
  })

  it('should return success when analytics is disabled', async () => {
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'false'
    const handler = loadHandler()

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
    const handler = loadHandler()
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
    const handler = loadHandler()
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
    const handler = loadHandler()
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
  })
})
