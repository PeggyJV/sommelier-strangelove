# 📊 Analytics Data Flow - Where Events Are Saved

## 🗄️ **Database Storage: Vercel KV (Redis)**

All analytics events are stored in **Vercel KV** (which is Redis-based). Here's exactly where:

### **Database Connection:**

```typescript
// src/lib/attribution/kv.ts
const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})
```

### **Storage Locations:**

#### **1. RPC Events (Transaction Tracking)**

**Key Pattern:** `rpc:event:{timestamp}:{id}`
**Example:** `rpc:event:1703123456789:01HXYZ123ABC`

**What's Stored:**

```json
{
  "stage": "submitted",
  "domain": "app.somm.finance",
  "pagePath": "/strategies/alpha-steth/manage",
  "sessionId": "abc123",
  "wallet": "0x1234...",
  "chainId": 1,
  "method": "eth_sendTransaction",
  "txHash": "0xabc123...",
  "to": "0xcontract...",
  "timestampMs": 1703123456789
}
```

#### **2. Analytics Events (Page Views, Clicks)**

**Key Pattern:** `analytics:event:{timestamp}:{id}`
**Example:** `analytics:event:1703123456789:01HXYZ123ABC`

**What's Stored:**

```json
{
  "event": "page_view",
  "properties": {
    "page": "/strategies/alpha-steth/manage",
    "source": "debank",
    "campaign": "alpha_launch"
  },
  "timestamp": 1703123456789,
  "session_id": "abc123",
  "server_timestamp": 1703123456789,
  "build_id": "abc123",
  "attribution": {
    "utm_source": "debank",
    "utm_medium": "message",
    "utm_campaign": "alpha_launch",
    "timestamp": 1703123456789,
    "session_id": "abc123"
  },
  "ip_hash": "hashed_ip_address",
  "user_agent_hash": "hashed_user_agent",
  "wallet_hash": "hashed_wallet_address"
}
```

#### **3. Index Keys (For Fast Lookups)**

**By Wallet:** `rpc:index:wallet:{wallet}:{day}`
**By Transaction:** `rpc:index:tx:{txHash}`
**By Contract:** `rpc:index:contract:{contract}:{day}`

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
// Cookie: somm_attrib
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

When any event happens (page view, wallet connect, deposit), the UTM data is attached:

```typescript
// src/pages/api/events.ts
function getAttribution(req: NextApiRequest) {
  const cookie = req.cookies.somm_attrib
  return JSON.parse(decodeURIComponent(cookie))
}
```

## 📈 **Conversion Tracking Flow**

### **Funnel Steps:**

#### **1. Page View Event**

```json
{
  "event": "page_view",
  "properties": {
    "page": "/strategies/alpha-steth/manage",
    "source": "debank"
  },
  "attribution": {
    "utm_source": "debank",
    "utm_campaign": "alpha_launch"
  }
}
```

#### **2. Wallet Connection Event**

```json
{
  "event": "wallet_connect",
  "properties": {
    "wallet_address": "0x1234...",
    "wallet_type": "metamask"
  },
  "attribution": {
    "utm_source": "debank",
    "utm_campaign": "alpha_launch"
  }
}
```

#### **3. Deposit Event**

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

## 🔍 **How to Query the Data**

### **1. Get All Events for a Wallet**

```bash
# API endpoint
GET /api/deposits/by-eth?address=0x1234...&limit=50
```

### **2. Get Events by Transaction Hash**

```bash
# API endpoint
GET /api/deposits/by-hash?tx=0xabc123...
```

### **3. Get RPC Events Report**

```bash
# API endpoint
GET /api/rpc-report?wallet=0x1234...&start=2024-01-01&end=2024-01-31
```

### **4. Direct KV Database Access**

```typescript
// Get specific event
const event = await getJson("rpc:event:1703123456789:01HXYZ123ABC")

// Get all events for a wallet on a specific day
const events = await zrange(
  "rpc:index:wallet:0x1234...:2024-01-15",
  0,
  -1
)

// Get all events for a transaction
const events = await smembers("rpc:index:tx:0xabc123...")
```

## 🏗️ **Database Schema Summary**

### **Event Storage:**

- **RPC Events:** `rpc:event:{timestamp}:{id}`
- **Analytics Events:** `analytics:event:{timestamp}:{id}`

### **Index Storage:**

- **By Wallet:** `rpc:index:wallet:{wallet}:{day}`
- **By Transaction:** `rpc:index:tx:{txHash}`
- **By Contract:** `rpc:index:contract:{contract}:{day}`

### **Attribution Storage:**

- **Cookie:** `somm_attrib` (30-day TTL)
- **Session:** Tied to `session_id`

## 🔐 **Privacy & Security**

### **Data Hashing:**

- **IP Address:** Hashed with salt
- **User Agent:** Hashed with salt
- **Wallet Address:** Hashed with salt
- **Salt:** `process.env.EVENTS_SALT`

### **Cookie Security:**

- **First-party only:** `somm_attrib`
- **30-day TTL:** Automatic expiration
- **HTTPS only:** Secure transmission

## 📊 **Campaign Attribution Example**

### **Debank Campaign Flow:**

1. **User clicks Debank message** → UTM captured
2. **User visits page** → Page view tracked with attribution
3. **User connects wallet** → Wallet connect tracked with attribution
4. **User makes deposit** → Deposit tracked with attribution

### **Data Query:**

```bash
# Get all events for Debank campaign
GET /api/rpc-report?contract=0xef417fce1883c6653e7dc6af7c6f85ccde84aa09&start=2024-01-01

# Filter by UTM source in application code
const debankEvents = events.filter(e =>
  e.attribution?.utm_source === 'debank'
)
```

## 🎯 **Key Takeaways**

1. **All events stored in Vercel KV** (Redis database)
2. **UTM parameters captured in middleware** and stored in first-party cookie
3. **Every event gets attribution data** from the cookie
4. **Multiple index keys** for fast lookups by wallet, transaction, contract
5. **Privacy-compliant** with hashed sensitive data
6. **30-day attribution window** via cookie TTL

This system gives you complete visibility into user journeys from campaign click to deposit conversion! 🚀
