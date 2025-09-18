# Priority 2: Attribution & Privacy Implementation

## Overview

This document outlines the implementation of Priority 2: Attribution & Privacy enhancements for the analytics system. This phase builds on the foundation established in Priority 1 and adds comprehensive privacy compliance, consent management, and advanced attribution tracking.

## ✅ **Implemented Features**

### **Consent Management System**

#### **ConsentBanner Component**
- **GDPR/CCPA compliant**: Full consent collection and management
- **Granular controls**: Separate consent for necessary, analytics, and marketing cookies
- **Persistent storage**: Consent preferences stored in localStorage with versioning
- **User-friendly interface**: Expandable preferences with clear explanations
- **Privacy links**: Direct links to privacy policy and cookie policy

#### **Consent Utilities**
- **`useConsentPreferences` hook**: React hook for accessing current consent state
- **`hasConsent` utility**: Check specific consent types programmatically
- **Version management**: Consent versioning for policy updates
- **Expiration handling**: Automatic consent expiration and renewal prompts

### **Privacy-Compliant Data Pipeline**

#### **Data Classification System**
- **Four-tier classification**: Public, Internal, Confidential, Restricted
- **Retention policies**: Automated data lifecycle management
- **Compliance frameworks**: GDPR, CCPA, PIPEDA, LGPD support
- **Processing records**: Complete audit trail of data processing activities

#### **Privacy Pipeline Features**
- **Secure hashing**: SHA-256 with environment-specific salt
- **Data retention**: Automatic cleanup based on classification
- **Consent verification**: Real-time consent checking
- **Deletion requests**: GDPR Article 17 (Right to erasure) support
- **Data portability**: GDPR Article 20 (Right to portability) implementation

### **Enhanced Attribution System**

#### **Advanced Attribution Tracking**
- **Multiple attribution models**: First-click, last-click, linear, time-decay, position-based
- **UTM parameter parsing**: Complete campaign tracking support
- **Referrer analysis**: Domain-level referrer tracking and classification
- **Device detection**: Mobile, tablet, desktop identification
- **Browser fingerprinting**: User agent parsing and browser identification

#### **Conversion Tracking**
- **Event-based conversions**: Flexible conversion event definition
- **Value attribution**: Monetary value tracking and attribution
- **Multi-touch attribution**: Complex customer journey analysis
- **Attribution windows**: Configurable click, view, and conversion windows

### **Data Retention & Deletion API**

#### **Privacy API Endpoints**
- **`/api/privacy/data-retention`**: Comprehensive privacy operations API
- **Cleanup operations**: Automated data cleanup based on retention policies
- **Audit operations**: Complete data processing audit reports
- **Deletion requests**: GDPR-compliant data deletion processing
- **Export operations**: Data portability and export functionality

#### **API Operations**
- **`cleanup`**: Remove expired data based on retention policies
- **`audit`**: Generate comprehensive compliance audit reports
- **`retention_report`**: Detailed retention policy compliance status
- **`delete`**: Process data deletion requests (GDPR Article 17)
- **`export`**: Generate data portability exports (GDPR Article 20)
- **`status`**: Check status of privacy requests

## 📁 **Files Added**

### **Core Components**
- `src/components/analytics/ConsentBanner.tsx` - Consent management UI component
- `src/utils/privacy-pipeline.ts` - Privacy-compliant data processing pipeline
- `src/utils/attribution-enhanced.ts` - Advanced attribution tracking system
- `src/pages/api/privacy/data-retention.ts` - Privacy operations API endpoint

### **Documentation & Testing**
- `docs/analytics/privacy-policy.md` - Comprehensive privacy policy
- `docs/analytics/priority-2-attribution-privacy.md` - This implementation guide
- `src/__tests__/privacy-attribution.test.ts` - Comprehensive test suite

## 🔧 **Environment Variables**

### **Required for Privacy Features**
```bash
# Enable privacy operations
NEXT_PUBLIC_PRIVACY_ENABLED=true

# Salt for data hashing (same as Priority 1)
EVENTS_SALT=your-secure-salt-here
```

### **Optional Privacy Configuration**
```bash
# Privacy compliance frameworks
PRIVACY_FRAMEWORKS=gdpr,ccpa

# Data retention overrides (in days)
RETENTION_ANALYTICS_DAYS=90
RETENTION_ATTRIBUTION_DAYS=30
RETENTION_SESSION_DAYS=7
RETENTION_ERROR_DAYS=30
```

## 🎯 **Privacy Compliance Features**

### **GDPR Compliance**
- **Article 6 - Lawfulness**: Legitimate interest and consent-based processing
- **Article 7 - Consent**: Granular consent collection and management
- **Article 12-14 - Transparency**: Clear privacy notices and information
- **Article 15 - Right of access**: Data subject access requests
- **Article 16 - Right to rectification**: Data correction mechanisms
- **Article 17 - Right to erasure**: Complete data deletion ("right to be forgotten")
- **Article 18 - Right to restriction**: Processing limitation requests
- **Article 20 - Right to portability**: Data export in structured format
- **Article 25 - Data protection by design**: Privacy-by-design implementation

### **CCPA Compliance**
- **Right to know**: Information about data collection and use
- **Right to delete**: Personal information deletion requests
- **Right to opt-out**: Sale of personal information opt-out
- **Right to non-discrimination**: Equal service regardless of privacy choices

### **Data Minimization**
- **Collection limitation**: Only collect necessary data
- **Purpose limitation**: Use data only for stated purposes
- **Storage limitation**: Automatic data retention and deletion
- **Accuracy**: Data accuracy and correction mechanisms

## 🔒 **Security Features**

### **Data Protection**
- **Encryption**: SHA-256 hashing for all sensitive data
- **Access controls**: Strict access controls and authentication
- **Audit trails**: Complete processing activity logging
- **Data classification**: Tiered data protection based on sensitivity

### **Privacy Controls**
- **Consent management**: Granular consent collection and storage
- **Opt-out mechanisms**: Easy privacy preference management
- **Data deletion**: Automated and manual data deletion
- **Export functionality**: Data portability and export capabilities

## 📊 **Attribution Models**

### **Available Models**
1. **First-click attribution**: Credit to first interaction
2. **Last-click attribution**: Credit to final interaction
3. **Linear attribution**: Equal credit across all touchpoints
4. **Time-decay attribution**: More credit to recent interactions
5. **Position-based attribution**: 40% first, 40% last, 20% middle

### **Attribution Windows**
- **Click window**: 30 days (configurable)
- **View window**: 1 day (configurable)
- **Conversion window**: 90 days (configurable)

## 🧪 **Testing**

### **Test Coverage**
- **Privacy pipeline**: Data processing, retention, and deletion
- **Attribution system**: UTM parsing, device detection, conversion tracking
- **API endpoints**: All privacy operations and error handling
- **Consent management**: Consent collection, storage, and verification
- **Compliance**: GDPR and CCPA compliance verification

### **Test Categories**
- **Unit tests**: Individual component and utility testing
- **Integration tests**: API endpoint and data flow testing
- **Privacy tests**: Consent and data protection verification
- **Attribution tests**: Campaign tracking and conversion attribution

## 📈 **Usage Examples**

### **Consent Management**
```typescript
import { ConsentBanner, useConsentPreferences, hasConsent } from '@/components/analytics/ConsentBanner'

// Check if analytics consent is given
if (hasConsent('analytics')) {
  // Track analytics events
  serverAnalytics.track('page_view')
}

// Use consent preferences in component
function MyComponent() {
  const preferences = useConsentPreferences()
  
  return (
    <div>
      {preferences?.analytics && <AnalyticsWidget />}
      <ConsentBanner 
        onConsentChange={handleConsentChange}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
      />
    </div>
  )
}
```

### **Privacy Operations**
```typescript
import { privacyPipeline, DataClassification } from '@/utils/privacy-pipeline'

// Record data processing activity
privacyPipeline.recordDataProcessing(
  'user-session-123',
  DataClassification.CONFIDENTIAL,
  'analytics tracking',
  'user-123',
  ['user_behavior', 'device_info']
)

// Request data deletion
const requestId = privacyPipeline.requestDataDeletion('user-123', 'erasure')

// Get compliance report
const report = privacyPipeline.getComplianceReport()
```

### **Enhanced Attribution**
```typescript
import { enhancedAttribution, AttributionModel } from '@/utils/attribution-enhanced'

// Create attribution data
const attribution = enhancedAttribution.createOrUpdateAttribution(
  'session-123',
  { utm_source: 'google', utm_medium: 'cpc' },
  'https://google.com',
  navigator.userAgent
)

// Track conversion
enhancedAttribution.trackConversion('session-123', 'deposit_completed', 100)

// Calculate attribution credits
const credits = enhancedAttribution.calculateAttributionCredit(
  'session-123',
  AttributionModel.LAST_CLICK
)
```

### **Privacy API Usage**
```typescript
// Cleanup expired data
const cleanupResponse = await fetch('/api/privacy/data-retention', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'cleanup',
    max_age: 30 * 24 * 60 * 60 * 1000 // 30 days
  })
})

// Request data deletion
const deletionResponse = await fetch('/api/privacy/data-retention', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'delete',
    data_subject_id: 'user-123',
    request_type: 'erasure'
  })
})
```

## 🚀 **Next Steps**

This implementation completes **Priority 2: Attribution & Privacy**. The next phase will implement:

- **Priority 3**: Manage view instrumentation
- **Priority 4**: Testing & QA setup
- **Priority 5**: Dashboard & reporting

## 📋 **Related PRs**

- **[PR #1851](https://github.com/PeggyJV/sommelier-strangelove/pull/1851)** - Project plan and roadmap (DRAFT)
- **[PR #1854](https://github.com/PeggyJV/sommelier-strangelove/pull/1854)** - Alpha stETH deposits analytics (MERGED)
- **[PR #1856](https://github.com/PeggyJV/sommelier-strangelove/pull/1856)** - Priority 1: Server-side event collection (OPEN)

## 🔍 **Ready for Review**

This implementation provides comprehensive privacy compliance and advanced attribution tracking while maintaining the highest standards of data protection and user privacy. The system is ready for integration with the existing analytics infrastructure and can be extended for additional privacy and attribution needs.

**Estimated effort**: 2-3 days (Priority 2 complete)
**Next phase**: Priority 3 - Manage view instrumentation
