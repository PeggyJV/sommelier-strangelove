# 📊 Analytics PR Guide - For Everyone

## 🤔 What Does This PR Do? (In Simple Terms)

**Think of it like a security camera for your website that tracks:**

1. **Who visits** your Alpha stETH page
2. **Where they came from** (Twitter, Debank message, etc.)
3. **What they do** (connect wallet, make deposit)
4. **If they actually deposit money** (conversion)

## 🎯 Why Do We Need This?

**Before this PR:**

- We send 100 Debank messages → We have NO IDEA if anyone actually used them
- We post on Twitter → We have NO IDEA if it brings customers
- We spend money on marketing → We have NO IDEA if it works

**After this PR:**

- We send 100 Debank messages → We can see exactly who clicked and who deposited
- We post on Twitter → We can see which posts bring the most customers
- We spend money on marketing → We know exactly what works and what doesn't

## 🔧 How It Works (Step by Step)

### Step 1: User Clicks Link

```
User clicks: https://app.somm.finance/strategies/alpha-steth/manage?src=debank_active
```

### Step 2: System Records Visit

```
✅ "Someone from Debank campaign visited Alpha stETH page"
```

### Step 3: User Connects Wallet

```
✅ "Same person connected their wallet"
```

### Step 4: User Makes Deposit

```
✅ "Same person deposited 10 ETH - CONVERSION!"
```

### Step 5: We Get Report

```
📊 Debank Campaign Results:
- 100 messages sent
- 15 people clicked link
- 8 people connected wallet
- 2 people made deposits
- Conversion rate: 2%
```

## 🧪 How to Test This (Super Easy)

### Test 1: Basic Tracking

1. **Open browser** → Go to `http://localhost:3000/strategies/alpha-steth/manage?src=test_campaign`
2. **Check console** → Should see: `"Analytics: Page view tracked"`
3. **Check database** → Should see new record with `src=test_campaign`

### Test 2: Campaign Attribution

1. **Click link**: `http://localhost:3000/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=test`
2. **Connect wallet** → Should track: `"Wallet connected from Twitter campaign"`
3. **Make deposit** → Should track: `"Deposit from Twitter campaign"`

### Test 3: Conversion Tracking

1. **Visit page** with campaign link
2. **Connect wallet**
3. **Make small deposit** (like 0.001 ETH)
4. **Check reports** → Should show conversion

## 📁 Files This PR Adds

### 1. `src/pages/api/events.ts`

**What it does:** Records when people visit pages, connect wallets, make deposits
**Like:** A security camera that records everything

### 2. `src/utils/analytics-server.ts`

**What it does:** Helper functions to send tracking data
**Like:** The remote control for the security camera

### 3. `src/middleware/analytics.ts`

**What it does:** Captures UTM parameters from URLs
**Like:** Reading the address on a letter to know where it came from

### 4. `middleware.ts` (Updated)

**What it does:** Runs the analytics on every page visit
**Like:** Turning on the security camera for every visitor

## 🔍 How to Verify It's Working

### Method 1: Check Browser Console

1. Open browser developer tools (F12)
2. Go to Console tab
3. Visit page with `?src=test`
4. Should see: `"Analytics: Event tracked"`

### Method 2: Check Network Tab

1. Open browser developer tools (F12)
2. Go to Network tab
3. Visit page with campaign link
4. Should see request to `/api/events`

### Method 3: Check Database

1. Look in your KV database
2. Should see new records with campaign data
3. Records should have: `source`, `campaign`, `timestamp`

## 🚨 Common Problems & Solutions

### Problem: "Analytics not working"

**Solution:** Check if `NEXT_PUBLIC_ANALYTICS_ENABLED=true` in environment

### Problem: "No events being tracked"

**Solution:** Check browser console for errors

### Problem: "UTM parameters not captured"

**Solution:** Make sure middleware is running

## 📊 What Reports Will Look Like

### Campaign Performance Report

```
Campaign: Debank Messages
Period: September 16-30, 2025
Results:
- Messages sent: 100
- Clicks: 15 (15%)
- Wallet connections: 8 (53% of clicks)
- Deposits: 2 (25% of connections)
- Total deposited: 10 ETH
- Conversion rate: 2%
```

### Source Performance Report

```
Source Performance:
- Twitter: 45 visits, 12 deposits (27% conversion)
- Debank: 15 visits, 2 deposits (13% conversion)
- Direct: 200 visits, 50 deposits (25% conversion)
```

## ✅ Checklist for Testing

- [ ] Visit page with `?src=test` → See tracking in console
- [ ] Visit page with `?utm_source=twitter` → See UTM captured
- [ ] Connect wallet → See wallet connection tracked
- [ ] Make deposit → See deposit tracked
- [ ] Check database → See all events recorded
- [ ] Generate report → See conversion data

## 🎉 Success Criteria

**This PR is working if:**

1. ✅ Page visits are tracked
2. ✅ UTM parameters are captured
3. ✅ Wallet connections are recorded
4. ✅ Deposits are attributed to campaigns
5. ✅ Reports show conversion rates

**This PR is NOT working if:**

1. ❌ No events in console
2. ❌ No requests to `/api/events`
3. ❌ No data in database
4. ❌ UTM parameters missing
5. ❌ Deposits not attributed

## 🔗 Useful Links

- **PR Link:** https://github.com/PeggyJV/sommelier-strangelove/pull/1862
- **Test URL:** `http://localhost:3000/strategies/alpha-steth/manage?src=test_campaign`
- **Environment Setup:** `docs/analytics/environment-setup.md`

---

**Remember:** This is like adding a security camera to your store. You'll finally know who's coming in, where they heard about you, and if they actually buy something!
