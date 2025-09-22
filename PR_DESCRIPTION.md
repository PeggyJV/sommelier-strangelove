# 🚀 Analytics System Implementation - PR #1862

## 📋 **Overview**

This PR implements a comprehensive analytics system for tracking user behavior, campaign attribution, and conversion funnels. The system captures UTM parameters, tracks user journeys from campaign clicks to deposits, and stores all data securely in Vercel KV.

## 🎯 **What This PR Does**

### **Core Features:**
- ✅ **UTM Parameter Capture:** Source, medium, campaign from URLs
- ✅ **Session Attribution:** Link all user actions to original campaign  
- ✅ **First-party Cookies:** Store campaign data securely (30-day TTL)
- ✅ **Conversion Tracking:** Track page views → wallet connections → deposits
- ✅ **Privacy Compliance:** Hash sensitive data (IP, wallet addresses, user agents)
- ✅ **Real-time Analytics:** Server-side event collection and enrichment

### **Files Added:**
- `src/pages/api/events.ts` - Analytics event collection endpoint
- `src/middleware/analytics.ts` - UTM parameter capture middleware
- `src/utils/analytics.ts` - Client-side analytics wrapper
- `src/utils/analytics-server.ts` - Server-side analytics utilities
- `src/utils/webVitals.ts` - Performance metrics tracking
- `docs/analytics/` - Complete documentation suite

## 🗄️ **Data Storage: Vercel KV (Redis)**

### **Event Storage Locations:**

#### **1. RPC Events (Transaction Tracking)**
- **Key Pattern:** `rpc:event:{timestamp}:{id}`
- **Contains:** Transaction data, wallet addresses, contract interactions
- **Example:** `rpc:event:1703123456789:01HXYZ123ABC`

#### **2. Analytics Events (Page Views, Clicks)**
- **Key Pattern:** `analytics:event:{timestamp}:{id}`  
- **Contains:** Page views, UTM attribution, user actions
- **Example:** `analytics:event:1703123456789:01HXYZ123ABC`

#### **3. Index Keys (For Fast Lookups)**
- **By Wallet:** `rpc:index:wallet:{wallet}:{day}`
- **By Transaction:** `rpc:index:tx:{txHash}`
- **By Contract:** `rpc:index:contract:{contract}:{day}`

## 🔄 **UTM Tracking Flow**

### **Step 1: URL with UTM Parameters**
```
https://app.somm.finance/strategies/alpha-steth/manage?utm_source=debank&utm_medium=message&utm_campaign=alpha_launch
```

### **Step 2: Middleware Captures UTM**
```typescript
// src/middleware/analytics.ts
function getUTMParams(request: NextRequest) {
  const url = new URL(request.url)
  return {
    utm_source: url.searchParams.get("utm_source"), // "debank"
    utm_medium: url.searchParams.get("utm_medium"), // "message"
    utm_campaign: url.searchParams.get("utm_campaign"), // "alpha_launch"
    utm_content: url.searchParams.get("utm_content"),
    utm_term: url.searchParams.get("utm_term"),
  }
}
```

### **Step 3: First-Party Cookie Storage**
```typescript
// Cookie: somm_attrib (30-day TTL)
{
  "utm_source": "debank",
  "utm_medium": "message",
  "utm_campaign": "alpha_launch",
  "timestamp": 1703123456789,
  "session_id": "abc123",
  "referrer": "https://debank.com"
}
```

### **Step 4: Event Attribution**
Every event (page view, wallet connect, deposit) gets UTM data attached automatically.

## 📈 **Conversion Tracking Funnel**

### **Complete User Journey:**
1. **Page View Event** → Tracked with UTM attribution
2. **Wallet Connection Event** → Tracked with UTM attribution  
3. **Deposit Event** → Tracked with UTM attribution

**All linked by:** `session_id` and `utm_campaign`

### **Example Campaign Attribution:**
```json
{
  "event": "deposit",
  "properties": {
    "wallet_address": "0x1234...",
    "amount": "1.5",
    "token": "stETH",
    "transaction_hash": "0xabc123..."
  },
  "attribution": {
    "utm_source": "debank",
    "utm_campaign": "alpha_launch"
  }
}
```

## 🔍 **API Endpoints for Data Query**

### **1. Get Events by Wallet**
```bash
GET /api/deposits/by-eth?address=0x1234...&limit=50
```

### **2. Get Events by Transaction Hash**
```bash
GET /api/deposits/by-hash?tx=0xabc123...
```

### **3. Get RPC Events Report**
```bash
GET /api/rpc-report?wallet=0x1234...&start=2024-01-01&end=2024-01-31
```

### **4. Analytics Event Collection**
```bash
POST /api/events
Content-Type: application/json

{
  "event": "page_view",
  "properties": {
    "page": "/strategies/alpha-steth/manage",
    "source": "debank"
  }
}
```

## 🔐 **Privacy & Security**

### **Data Hashing:**
- **IP Address:** Hashed with salt (`process.env.EVENTS_SALT`)
- **User Agent:** Hashed with salt
- **Wallet Address:** Hashed with salt

### **Cookie Security:**
- **First-party only:** `somm_attrib`
- **30-day TTL:** Automatic expiration
- **HTTPS only:** Secure transmission

## 🧪 **Testing**

### **Test Files:**
- `src/__tests__/analytics-server.test.ts` - Server-side analytics tests
- `test-analytics.js` - Manual testing script
- `ANALYTICS_TEST_CHECKLIST.md` - Step-by-step testing guide

### **Test URLs:**
```bash
# Basic tracking test
https://app.somm.finance/strategies/alpha-steth/manage?src=test

# UTM parameter test  
https://app.somm.finance/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=test

# Debank campaign simulation
https://app.somm.finance/strategies/alpha-steth/manage?src=debank_test
```

### **Manual Testing Steps:**
1. Open test URLs in browser
2. Check browser console for tracking messages
3. Check Network tab for POST requests to `/api/events`
4. Verify API returns 200 status
5. Check KV database for stored events

## 🚀 **Live Testing Plan**

### **Pre-Launch Checklist:**
- [ ] PR approved and merged to main
- [ ] Production deployment successful
- [ ] Environment variables set in production
- [ ] KV database accessible

### **Live Testing Scenarios:**
1. **Basic Page Tracking** - Verify page views are tracked
2. **UTM Parameter Capture** - Test campaign attribution
3. **Real Campaign Simulation** - Test complete conversion funnel
4. **Performance Impact** - Ensure no blocking requests

### **Success Criteria:**
- ✅ All test URLs show tracking in console
- ✅ All test URLs make API calls
- ✅ API endpoint responds successfully
- ✅ No JavaScript errors
- ✅ Page performance acceptable

## 📊 **Campaign Attribution Example**

### **Debank Campaign Flow:**
1. **User clicks Debank message** → UTM captured
2. **User visits page** → Page view tracked with `utm_source=debank`
3. **User connects wallet** → Wallet connect tracked with attribution
4. **User makes deposit** → Deposit tracked with attribution

### **Result:** Complete conversion funnel from campaign click to deposit!

## 🔧 **Environment Variables Required**

```bash
# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=your-secure-salt-here

# KV Database
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token

# Optional: Product Analytics Integration
PRODUCT_ANALYTICS_WRITE_KEY=your-key
```

## 📚 **Documentation**

### **Complete Documentation Suite:**
- `ANALYTICS_PR_GUIDE.md` - Simple explanation for all team members
- `ANALYTICS_DATA_FLOW.md` - Technical data flow and storage details
- `ANALYTICS_TEST_CHECKLIST.md` - Step-by-step testing guide
- `LIVE_TESTING_PLAN.md` - Production testing strategy
- `docs/analytics/` - Detailed technical documentation

## 🎯 **Business Impact**

### **Marketing Attribution:**
- Track which campaigns drive the most deposits
- Measure conversion rates by source (Debank, Twitter, etc.)
- Optimize marketing spend based on data

### **User Behavior Insights:**
- Understand user journey from click to deposit
- Identify drop-off points in conversion funnel
- Improve user experience based on data

### **Campaign ROI:**
- Measure return on investment for each campaign
- Compare performance across different channels
- Make data-driven marketing decisions

## 🚨 **Rollback Plan**

### **If Issues Found:**
1. **Immediate:** Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false`
2. **Redeploy:** Push to production
3. **Investigate:** Check logs and database
4. **Fix:** Address issues in hotfix
5. **Re-enable:** Turn analytics back on when ready

## 🎉 **Ready for Production**

This analytics system provides:
- ✅ Complete campaign attribution tracking
- ✅ Privacy-compliant data collection
- ✅ Real-time event processing
- ✅ Comprehensive testing coverage
- ✅ Detailed documentation
- ✅ Emergency rollback procedures

**The system is ready for production deployment and will provide valuable insights into user behavior and campaign performance!** 🚀
