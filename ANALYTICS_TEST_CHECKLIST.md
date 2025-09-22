# ✅ Analytics PR Test Checklist

## 🚀 Quick Start (5 minutes)

### Step 1: Start Your Dev Server

```bash
npm run dev
```

**Expected:** Server starts on http://localhost:3001

### Step 2: Run Test Script

```bash
node test-analytics.js
```

**Expected:** Shows test URLs and instructions

### Step 3: Test Basic Tracking

1. Open: `http://localhost:3001/strategies/alpha-steth/manage?src=test_campaign`
2. Press F12 (open developer tools)
3. Go to Console tab
4. **Look for:** `"Analytics: Event tracked"` or similar message

### Step 4: Test UTM Capture

1. Open: `http://localhost:3001/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=test`
2. Go to Network tab in developer tools
3. **Look for:** POST request to `/api/events`
4. **Check payload:** Should contain UTM parameters

## 🔍 Detailed Testing

### ✅ File Existence Check

- [ ] `src/pages/api/events.ts` exists
- [ ] `src/utils/analytics-server.ts` exists
- [ ] `src/middleware/analytics.ts` exists
- [ ] `middleware.ts` has been updated
- [ ] `docs/analytics/environment-setup.md` exists

### ✅ Environment Check

- [ ] `NEXT_PUBLIC_ANALYTICS_ENABLED=true` in .env
- [ ] `EVENTS_SALT=your-secure-salt-here` in .env
- [ ] Server restarted after env changes

### ✅ Basic Functionality

- [ ] Page visits are tracked
- [ ] UTM parameters are captured
- [ ] Campaign source is recorded
- [ ] Timestamps are accurate

### ✅ API Endpoint

- [ ] `/api/events` responds to POST requests
- [ ] Accepts JSON payload
- [ ] Returns success response
- [ ] Handles errors gracefully

### ✅ Campaign Tracking

- [ ] `?src=debank_active` is tracked
- [ ] `?utm_source=twitter` is captured
- [ ] `?utm_campaign=test` is recorded
- [ ] Multiple parameters work together

## 🧪 Test Scenarios

### Scenario 1: Debank Campaign

**URL:** `http://localhost:3001/strategies/alpha-steth/manage?src=debank_active`
**Expected Result:**

- Console shows tracking message
- Network shows API call
- Database record with `source: "debank_active"`

### Scenario 2: Twitter Campaign

**URL:** `http://localhost:3001/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=alpha_steth_video`
**Expected Result:**

- UTM parameters captured
- Campaign attributed correctly
- All data stored in database

### Scenario 3: Direct Visit

**URL:** `http://localhost:3001/strategies/alpha-steth/manage`
**Expected Result:**

- Still tracked (no campaign source)
- Basic page view recorded
- No UTM parameters

## 🚨 Common Issues & Fixes

### Issue: "No tracking messages in console"

**Fix:**

1. Check `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
2. Restart dev server
3. Check for JavaScript errors

### Issue: "No API calls in Network tab"

**Fix:**

1. Check if `/api/events` endpoint exists
2. Check middleware is running
3. Check for server errors

### Issue: "UTM parameters not captured"

**Fix:**

1. Check `src/middleware/analytics.ts` exists
2. Check `middleware.ts` includes analytics
3. Check URL format is correct

### Issue: "Database not updated"

**Fix:**

1. Check KV database connection
2. Check environment variables
3. Check API endpoint implementation

## 📊 Success Criteria

**The PR is working if:**

- ✅ All test scenarios pass
- ✅ Console shows tracking messages
- ✅ Network shows API calls
- ✅ Database has new records
- ✅ Campaign data is captured correctly

**The PR is NOT working if:**

- ❌ No console messages
- ❌ No network requests
- ❌ No database updates
- ❌ UTM parameters missing
- ❌ JavaScript errors

## 🎯 Performance Check

- [ ] Page load time not significantly affected
- [ ] Analytics don't block page rendering
- [ ] API calls are fast (< 100ms)
- [ ] No memory leaks in browser

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: ___________

Basic Tracking: ✅/❌
UTM Capture: ✅/❌
Campaign Attribution: ✅/❌
API Endpoint: ✅/❌
Database Storage: ✅/❌

Issues Found:
-

Overall Status: ✅ Working / ❌ Not Working
```

## 🔗 Resources

- **PR:** https://github.com/PeggyJV/sommelier-strangelove/pull/1862
- **Guide:** ANALYTICS_PR_GUIDE.md
- **Test Script:** test-analytics.js
- **Environment Setup:** docs/analytics/environment-setup.md

---

**Remember:** If you can complete this checklist, the analytics PR is working! 🎉
