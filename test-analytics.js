#!/usr/bin/env node

// Simple Analytics Test Script
// Run this to test if the analytics PR is working

const BASE_URL = "http://localhost:3001" // Your dev server

console.log("🧪 Testing Analytics PR...")
console.log("========================")

async function testAnalytics() {
  const tests = [
    {
      name: "Basic Page View Tracking",
      url: `${BASE_URL}/strategies/alpha-steth/manage?src=test_campaign`,
      expected: "Page view should be tracked",
    },
    {
      name: "UTM Parameter Capture",
      url: `${BASE_URL}/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=test&utm_medium=social`,
      expected: "UTM parameters should be captured",
    },
    {
      name: "Debank Campaign Tracking",
      url: `${BASE_URL}/strategies/alpha-steth/manage?src=debank_active`,
      expected: "Debank campaign should be tracked",
    },
  ]

  console.log("\n📋 Test Cases:")
  tests.forEach((test, i) => {
    console.log(`${i + 1}. ${test.name}`)
    console.log(`   URL: ${test.url}`)
    console.log(`   Expected: ${test.expected}`)
    console.log("")
  })

  console.log("🔍 Manual Testing Steps:")
  console.log("1. Open each URL above in your browser")
  console.log("2. Open browser developer tools (F12)")
  console.log("3. Go to Console tab")
  console.log('4. Look for messages like: "Analytics: Event tracked"')
  console.log("5. Go to Network tab")
  console.log('6. Look for requests to "/api/events"')
  console.log("")

  console.log("📊 How to Check Results:")
  console.log("1. Check browser console for tracking messages")
  console.log("2. Check Network tab for API calls")
  console.log("3. Check your KV database for new records")
  console.log("4. Look for records with campaign data")
  console.log("")

  console.log("✅ Success Indicators:")
  console.log('- Console shows "Analytics: Event tracked"')
  console.log("- Network shows POST to /api/events")
  console.log("- Database has new records with campaign info")
  console.log("")

  console.log("❌ Failure Indicators:")
  console.log("- No console messages")
  console.log("- No network requests")
  console.log("- No database records")
  console.log("- JavaScript errors in console")
  console.log("")

  console.log("🚀 Quick Test Commands:")
  console.log("curl -X POST http://localhost:3001/api/events \\")
  console.log('  -H "Content-Type: application/json" \\')
  console.log(
    '  -d \'{"event": "test", "properties": {"test": true}}\''
  )
  console.log("")

  console.log("📁 Files to Check:")
  console.log("- src/pages/api/events.ts (should exist)")
  console.log("- src/utils/analytics-server.ts (should exist)")
  console.log("- src/middleware/analytics.ts (should exist)")
  console.log("- middleware.ts (should be updated)")
  console.log("")

  console.log("🔧 Environment Check:")
  console.log("Make sure you have:")
  console.log("- NEXT_PUBLIC_ANALYTICS_ENABLED=true")
  console.log("- EVENTS_SALT=your-secure-salt-here")
  console.log("")

  console.log("📞 Need Help?")
  console.log(
    "- Check the PR: https://github.com/PeggyJV/sommelier-strangelove/pull/1862"
  )
  console.log("- Read the guide: ANALYTICS_PR_GUIDE.md")
  console.log(
    "- Check environment setup: docs/analytics/environment-setup.md"
  )
}

testAnalytics().catch(console.error)
