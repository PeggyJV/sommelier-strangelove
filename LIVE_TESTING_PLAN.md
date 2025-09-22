# 🚀 Live Testing Plan - Analytics PR

## 📋 Pre-Launch Checklist

### ✅ **Before Testing:**
- [ ] PR approved and merged to main
- [ ] Production deployment successful
- [ ] Environment variables set in production
- [ ] KV database accessible
- [ ] All analytics files deployed

### 🔧 **Environment Setup:**
```bash
# Production environment variables
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=production-secure-salt-here
```

## 🧪 **Live Testing Scenarios**

### **Test 1: Basic Page Tracking**
**URL:** `https://app.somm.finance/strategies/alpha-steth/manage?src=live_test`
**Steps:**
1. Visit URL in production
2. Check browser console for tracking
3. Verify API call to `/api/events`
4. Check KV database for new record

**Expected Result:**
- ✅ Console shows tracking message
- ✅ Network shows POST to `/api/events`
- ✅ Database has record with `source: "live_test"`

### **Test 2: UTM Parameter Capture**
**URL:** `https://app.somm.finance/strategies/alpha-steth/manage?utm_source=twitter&utm_campaign=live_test&utm_medium=social`
**Steps:**
1. Visit URL with UTM parameters
2. Check if all UTM params captured
3. Verify campaign attribution
4. Test multiple parameter combinations

**Expected Result:**
- ✅ All UTM parameters captured
- ✅ Campaign properly attributed
- ✅ Data stored correctly

### **Test 3: Real Campaign Simulation**
**URL:** `https://app.somm.finance/strategies/alpha-steth/manage?src=debank_live_test`
**Steps:**
1. Simulate Debank message click
2. Connect wallet
3. Make small test deposit
4. Verify full conversion tracking

**Expected Result:**
- ✅ Page view tracked
- ✅ Wallet connection tracked
- ✅ Deposit attributed to campaign
- ✅ Complete funnel recorded

### **Test 4: Performance Impact**
**Steps:**
1. Measure page load time
2. Check for JavaScript errors
3. Verify no blocking requests
4. Test on mobile devices

**Expected Result:**
- ✅ Page load time < 3 seconds
- ✅ No JavaScript errors
- ✅ Analytics don't block rendering
- ✅ Works on mobile

## 📊 **Live Testing Tools**

### **Browser Testing:**
```bash
# Test basic tracking
curl -X POST https://app.somm.finance/api/events \
  -H "Content-Type: application/json" \
  -d '{"event": "live_test", "properties": {"test": true}}'
```

### **Database Verification:**
```bash
# Check if events are being stored
# (Use your KV database tools)
```

### **Performance Monitoring:**
```bash
# Check page load times
# Monitor for errors
# Verify API response times
```

## 🎯 **Success Criteria**

### **Must Pass:**
- [ ] Page visits tracked
- [ ] UTM parameters captured
- [ ] Campaign attribution working
- [ ] No JavaScript errors
- [ ] API endpoints responding
- [ ] Database storing events

### **Performance Targets:**
- [ ] Page load time < 3 seconds
- [ ] API response time < 100ms
- [ ] No memory leaks
- [ ] Mobile compatibility

## 🚨 **Rollback Plan**

### **If Issues Found:**
1. **Immediate:** Disable analytics with `NEXT_PUBLIC_ANALYTICS_ENABLED=false`
2. **Investigate:** Check logs and database
3. **Fix:** Address issues in hotfix
4. **Re-test:** Verify fixes work
5. **Re-enable:** Turn analytics back on

### **Emergency Contacts:**
- **Dev Team:** @zmanian, @poldsam
- **Infrastructure:** Check Vercel dashboard
- **Database:** Check KV database status

## 📈 **Post-Launch Monitoring**

### **First 24 Hours:**
- [ ] Monitor error rates
- [ ] Check event volume
- [ ] Verify data quality
- [ ] Monitor performance

### **First Week:**
- [ ] Generate conversion reports
- [ ] Check campaign attribution
- [ ] Monitor user behavior
- [ ] Optimize if needed

## 🔍 **Testing Checklist**

### **Day 1 - Basic Functionality:**
- [ ] Test all campaign URLs
- [ ] Verify UTM capture
- [ ] Check database storage
- [ ] Monitor error rates

### **Day 2 - Campaign Testing:**
- [ ] Test Debank campaign URLs
- [ ] Test Twitter campaign URLs
- [ ] Verify conversion tracking
- [ ] Check attribution accuracy

### **Day 3 - Performance & Edge Cases:**
- [ ] Test on different devices
- [ ] Test with slow connections
- [ ] Test with ad blockers
- [ ] Test error scenarios

### **Day 4 - Data Validation:**
- [ ] Verify all events recorded
- [ ] Check data accuracy
- [ ] Generate test reports
- [ ] Validate conversion rates

### **Day 5 - Production Ready:**
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] No critical issues
- [ ] Ready for real campaigns

## 📞 **Support & Escalation**

### **Level 1 - Self Service:**
- Check browser console
- Check network tab
- Check database
- Review logs

### **Level 2 - Team Support:**
- Contact dev team
- Check Vercel dashboard
- Review error logs
- Check environment

### **Level 3 - Emergency:**
- Disable analytics
- Rollback if needed
- Contact infrastructure team
- Escalate to management

## 🎉 **Go-Live Checklist**

### **Final Verification:**
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] No critical issues
- [ ] Documentation complete
- [ ] Team trained
- [ ] Monitoring in place

### **Launch Day:**
- [ ] Deploy to production
- [ ] Run live tests
- [ ] Monitor closely
- [ ] Be ready to rollback
- [ ] Celebrate success! 🎉

---

**Remember:** Take it slow, test thoroughly, and be ready to rollback if needed. Better to be safe than sorry! 🚀
