#!/usr/bin/env node

// Live Analytics Testing Script
// Run this AFTER the PR is approved and deployed to production

const PRODUCTION_URL = 'https://app.somm.finance'
const TEST_CAMPAIGNS = [
  {
    name: 'Debank Live Test',
    url: `${PRODUCTION_URL}/strategies/alpha-steth/manage?src=debank_live_test`,
    expected: 'Debank campaign tracking'
  },
  {
    name: 'Twitter Live Test', 
    url: `${PRODUCTION_URL}/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=live_test&utm_medium=social`,
    expected: 'Twitter UTM tracking'
  },
  {
    name: 'Direct Visit Test',
    url: `${PRODUCTION_URL}/strategies/alpha-steth/manage`,
    expected: 'Basic page tracking'
  }
]

console.log('🚀 LIVE ANALYTICS TESTING')
console.log('=========================')
console.log('')
console.log('⚠️  IMPORTANT: This tests PRODUCTION environment!')
console.log('')

async function runLiveTests() {
  console.log('📋 Live Test Scenarios:')
  console.log('')
  
  TEST_CAMPAIGNS.forEach((test, i) => {
    console.log(`${i + 1}. ${test.name}`)
    console.log(`   URL: ${test.url}`)
    console.log(`   Expected: ${test.expected}`)
    console.log('')
  })

  console.log('🔍 Manual Testing Steps:')
  console.log('1. Open each URL above in your browser')
  console.log('2. Open browser developer tools (F12)')
  console.log('3. Go to Console tab')
  console.log('4. Look for analytics tracking messages')
  console.log('5. Go to Network tab')
  console.log('6. Look for POST requests to /api/events')
  console.log('')

  console.log('🧪 API Endpoint Test:')
  console.log('Run this command to test the API directly:')
  console.log('')
  console.log(`curl -X POST ${PRODUCTION_URL}/api/events \\`)
  console.log('  -H "Content-Type: application/json" \\')
  console.log('  -d \'{"event": "live_test", "properties": {"test": true, "timestamp": "' + Date.now() + '"}}\'')
  console.log('')

  console.log('📊 What to Look For:')
  console.log('✅ Success Indicators:')
  console.log('- Console shows "Analytics: Event tracked"')
  console.log('- Network shows POST to /api/events')
  console.log('- API returns 200 status')
  console.log('- No JavaScript errors')
  console.log('')

  console.log('❌ Failure Indicators:')
  console.log('- No console messages')
  console.log('- No network requests')
  console.log('- API returns error status')
  console.log('- JavaScript errors in console')
  console.log('')

  console.log('🔧 Troubleshooting:')
  console.log('If tests fail:')
  console.log('1. Check if analytics is enabled in production')
  console.log('2. Check browser console for errors')
  console.log('3. Check network tab for failed requests')
  console.log('4. Check Vercel deployment logs')
  console.log('5. Check KV database connection')
  console.log('')

  console.log('📈 Performance Check:')
  console.log('- Page should load in < 3 seconds')
  console.log('- Analytics should not block page rendering')
  console.log('- API calls should complete in < 100ms')
  console.log('')

  console.log('🎯 Success Criteria:')
  console.log('The analytics system is working if:')
  console.log('- All test URLs show tracking in console')
  console.log('- All test URLs make API calls')
  console.log('- API endpoint responds successfully')
  console.log('- No JavaScript errors')
  console.log('- Page performance is acceptable')
  console.log('')

  console.log('🚨 Emergency Rollback:')
  console.log('If critical issues found:')
  console.log('1. Set NEXT_PUBLIC_ANALYTICS_ENABLED=false')
  console.log('2. Redeploy to production')
  console.log('3. Investigate and fix issues')
  console.log('4. Re-enable when ready')
  console.log('')

  console.log('📞 Support:')
  console.log('- PR: https://github.com/PeggyJV/sommelier-strangelove/pull/1862')
  console.log('- Vercel Dashboard: Check deployment status')
  console.log('- KV Database: Check event storage')
  console.log('')

  console.log('🎉 Ready to Test!')
  console.log('Open the URLs above and follow the testing steps.')
  console.log('Good luck! 🚀')
}

runLiveTests().catch(console.error)
