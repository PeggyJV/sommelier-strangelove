# Analytics Environment Configuration

This document outlines the environment variables required for the server-side analytics system.

## Required Environment Variables

### Core Analytics Configuration

```bash
# Enable/disable analytics collection
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Salt for hashing sensitive data (change in production)
EVENTS_SALT=your-secure-salt-here

# Product analytics service write key (optional)
PRODUCT_ANALYTICS_WRITE_KEY=your-analytics-write-key

# Build ID for tracking deployments
NEXT_PUBLIC_BUILD_ID=build-$(date +%s)
```

### Optional Analytics Services

```bash
# PostHog configuration
POSTHOG_PROJECT_API_KEY=your-posthog-key
POSTHOG_HOST=https://app.posthog.com

# Mixpanel configuration  
MIXPANEL_PROJECT_TOKEN=your-mixpanel-token

# Google Analytics 4 configuration
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-ga4-api-secret
```

## Environment Setup by Deployment

### Development
```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=dev-salt-change-me
NEXT_PUBLIC_BUILD_ID=dev-$(date +%s)
```

### Staging/Preview
```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=staging-salt-$(openssl rand -hex 16)
PRODUCT_ANALYTICS_WRITE_KEY=your-staging-write-key
NEXT_PUBLIC_BUILD_ID=preview-$(date +%s)
```

### Production
```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=$(openssl rand -hex 32)
PRODUCT_ANALYTICS_WRITE_KEY=your-production-write-key
NEXT_PUBLIC_BUILD_ID=prod-$(date +%s)
```

## Security Considerations

### EVENTS_SALT
- **Critical**: Must be unique per environment
- **Length**: Minimum 32 characters recommended
- **Generation**: Use cryptographically secure random generator
- **Storage**: Store securely, never commit to version control
- **Rotation**: Rotate periodically for enhanced security

### Analytics Write Keys
- Store in secure environment variable management
- Use different keys for different environments
- Rotate keys periodically
- Monitor usage and set up alerts for unusual activity

## Vercel Configuration

### Environment Variables in Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` | Production, Preview |
| `EVENTS_SALT` | `[secure-random-salt]` | Production, Preview |
| `PRODUCT_ANALYTICS_WRITE_KEY` | `[your-write-key]` | Production, Preview |

### Local Development

Create a `.env.local` file:

```bash
# Copy this file and update values
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=dev-salt-change-me
NEXT_PUBLIC_BUILD_ID=dev-$(date +%s)
```

## Testing Configuration

### Enable Analytics for Testing
```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=test-salt
NEXT_PUBLIC_BUILD_ID=test-$(date +%s)
```

### Disable Analytics for Testing
```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

## Monitoring and Debugging

### Check Analytics Status
```bash
# Check if analytics is enabled
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"event": "test_event", "properties": {"test": true}}'
```

### Expected Responses

**Analytics Enabled:**
```json
{
  "success": true,
  "event_id": 1234567890,
  "message": "Event collected successfully"
}
```

**Analytics Disabled:**
```json
{
  "success": true,
  "message": "Analytics disabled"
}
```

## Troubleshooting

### Common Issues

1. **Events not being collected**
   - Check `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
   - Verify API endpoint is accessible
   - Check browser network tab for errors

2. **Invalid event format errors**
   - Ensure event object has required `event` field
   - Check that properties is an object if provided
   - Verify timestamp is a number if provided

3. **Attribution not working**
   - Check middleware is properly configured
   - Verify UTM parameters in URL
   - Check cookie is being set in browser

### Debug Mode

Add to environment for detailed logging:

```bash
NEXT_PUBLIC_ANALYTICS_DEBUG=true
```

This will enable console logging for all analytics events.
