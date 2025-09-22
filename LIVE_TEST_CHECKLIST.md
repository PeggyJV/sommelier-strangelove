# ✅ Live Testing Checklist

## 🚀 **Pre-Launch (Before Testing)**

- [ ] PR approved and merged to main branch
- [ ] Production deployment successful
- [ ] Environment variables set in production
- [ ] KV database accessible
- [ ] All analytics files deployed

## 🧪 **Live Testing (Day 1)**

### **Basic Functionality Test**
- [ ] Visit: `https://app.somm.finance/strategies/alpha-steth/manage?src=live_test`
- [ ] Check browser console for tracking message
- [ ] Check Network tab for POST to `/api/events`
- [ ] Verify no JavaScript errors

### **UTM Parameter Test**
- [ ] Visit: `https://app.somm.finance/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=live_test`
- [ ] Verify UTM parameters captured
- [ ] Check campaign attribution
- [ ] Verify data stored correctly

### **API Endpoint Test**
- [ ] Run: `curl -X POST https://app.somm.finance/api/events -H "Content-Type: application/json" -d '{"event": "test"}'`
- [ ] Verify API returns 200 status
- [ ] Check response is correct
- [ ] Verify no errors

### **Performance Test**
- [ ] Page loads in < 3 seconds
- [ ] Analytics don't block rendering
- [ ] No memory leaks
- [ ] Works on mobile

## 📊 **Campaign Testing (Day 2)**

### **Debank Campaign Simulation**
- [ ] Visit: `https://app.somm.finance/strategies/alpha-steth/manage?src=debank_live_test`
- [ ] Connect wallet
- [ ] Make small test deposit
- [ ] Verify full conversion tracking

### **Twitter Campaign Simulation**
- [ ] Visit: `https://app.somm.finance/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=live_test`
- [ ] Connect wallet
- [ ] Make small test deposit
- [ ] Verify campaign attribution

### **Direct Visit Test**
- [ ] Visit: `https://app.somm.finance/strategies/alpha-steth/manage`
- [ ] Verify basic tracking works
- [ ] Check no campaign attribution
- [ ] Verify data quality

## 🔍 **Data Validation (Day 3)**

### **Database Check**
- [ ] Events are being stored
- [ ] Campaign data is accurate
- [ ] Timestamps are correct
- [ ] No duplicate events

### **Conversion Tracking**
- [ ] Page views tracked
- [ ] Wallet connections tracked
- [ ] Deposits attributed correctly
- [ ] Funnel data complete

### **Report Generation**
- [ ] Can generate campaign reports
- [ ] Conversion rates calculated
- [ ] Data export works
- [ ] Reports are accurate

## 🚨 **Emergency Procedures**

### **If Critical Issues Found:**
- [ ] Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false`
- [ ] Redeploy to production
- [ ] Notify team
- [ ] Investigate issues
- [ ] Fix and re-test

### **If Performance Issues:**
- [ ] Check page load times
- [ ] Monitor API response times
- [ ] Check for memory leaks
- [ ] Optimize if needed

### **If Data Issues:**
- [ ] Check database connection
- [ ] Verify event storage
- [ ] Check data accuracy
- [ ] Fix data issues

## 📈 **Success Criteria**

### **Must Pass:**
- [ ] All test URLs show tracking
- [ ] All test URLs make API calls
- [ ] API endpoint responds successfully
- [ ] No JavaScript errors
- [ ] Page performance acceptable
- [ ] Data stored correctly

### **Performance Targets:**
- [ ] Page load time < 3 seconds
- [ ] API response time < 100ms
- [ ] No memory leaks
- [ ] Mobile compatibility

## 🎯 **Go-Live Decision**

### **Ready to Go Live If:**
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] No critical issues
- [ ] Data quality good
- [ ] Team confident

### **Not Ready If:**
- [ ] Any critical issues
- [ ] Performance problems
- [ ] Data quality issues
- [ ] Team not confident

## 📞 **Support Contacts**

- **Dev Team:** @zmanian, @poldsam
- **Infrastructure:** Vercel dashboard
- **Database:** KV database status
- **Emergency:** Disable analytics immediately

## 🎉 **Launch Day**

- [ ] Deploy to production
- [ ] Run live tests
- [ ] Monitor closely
- [ ] Be ready to rollback
- [ ] Celebrate success! 🚀

---

**Remember:** Take it slow, test thoroughly, and be ready to rollback if needed!
