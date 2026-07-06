# Reports System - Production Testing & Verification

## Pre-Launch Testing Checklist

### 1. PDF Generation Testing

#### Test Case 1.1: Basic Report Generation
```javascript
// Backend test
const interview = await Interview.findById(testInterviewId);
const report = buildCandidateReport(interview);
const filePath = await generatePDFReport(report, "test-report");
// ✓ Verify: File exists at backend/reports/
// ✓ Verify: PDF opens without errors
// ✓ Verify: All sections present
```

#### Test Case 1.2: Edge Cases
- [ ] Missing candidate data
- [ ] Empty scores object
- [ ] Null answers array
- [ ] Very long text fields
- [ ] Special characters in names

#### Test Case 1.3: Large Reports
- [ ] 50+ interview answers
- [ ] Long text content
- [ ] Multiple page breaks
- [ ] Footer consistency

### 2. Caching Testing

#### Test Case 2.1: Cache Operations
```javascript
// Test cache set/get
setCachedReport('test-id', { data: 'test' });
const cached = getCachedReport('test-id');
// ✓ Verify: Data retrieved matches stored data
```

#### Test Case 2.2: Cache Invalidation
- [ ] Manual invalidation works
- [ ] List cache cleared on updates
- [ ] Expired entries removed
- [ ] Memory not leaking

#### Test Case 2.3: Cache Stats
```javascript
const stats = getCacheStats();
console.log(stats);
// ✓ Verify: Keys count correct
// ✓ Verify: Hit/miss rates reasonable
```

### 3. Export Testing

#### Test Case 3.1: CSV Export
```bash
# Request
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports/export?format=csv"

# ✓ Verify: CSV file downloads
# ✓ Verify: Columns formatted correctly
# ✓ Verify: Data integrity
# ✓ Verify: Special characters escaped
```

#### Test Case 3.2: Excel Export
```bash
# Request
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports/export?format=xlsx"

# ✓ Verify: XLSX file downloads
# ✓ Verify: Opens in Excel/Sheets
# ✓ Verify: Column widths appropriate
# ✓ Verify: Data types preserved
```

#### Test Case 3.3: Export Cleanup
- [ ] Old files deleted after 24 hours
- [ ] Active files not deleted
- [ ] Cleanup function callable manually

### 4. Archive Testing

#### Test Case 4.1: Archive Operations
```javascript
// Archive report
const result = await archiveReport(reportId);
// ✓ Verify: Archive file created
// ✓ Verify: Metadata stored correctly
// ✓ Verify: Database updated
```

#### Test Case 4.2: Archive Status
```javascript
const archived = isReportArchived(reportId);
// ✓ Verify: Returns true for archived
// ✓ Verify: Returns false for active
```

#### Test Case 4.3: Restore Operations
```javascript
await restoreReport(reportId);
// ✓ Verify: Archive file deleted
// ✓ Verify: Report accessible
```

### 5. API Endpoint Testing

#### Test Case 5.1: GET /api/reports
```bash
# Test filtering
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports?search=john&recommendation=HIRE&status=completed&page=1&limit=10"

# ✓ Verify: Returns paginated results
# ✓ Verify: Filters applied correctly
# ✓ Verify: Total count accurate
# ✓ Verify: Pagination info correct
```

#### Test Case 5.2: GET /api/reports/:id
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports/123456789"

# ✓ Verify: PDF downloads
# ✓ Verify: Content-Type correct
# ✓ Verify: File readable
```

#### Test Case 5.3: PUT /api/reports/:id/archive
```bash
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports/123456789/archive"

# ✓ Verify: Success response
# ✓ Verify: Archive created
# ✓ Verify: Report archived
```

#### Test Case 5.4: DELETE /api/reports/:id
```bash
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports/123456789"

# ✓ Verify: Success response
# ✓ Verify: Report deleted
# ✓ Verify: Cache invalidated
```

#### Test Case 5.5: GET /api/reports/archive/stats
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports/archive/stats"

# ✓ Verify: Returns stats object
# ✓ Verify: Archive count accurate
# ✓ Verify: Size calculation correct
```

### 6. Security Testing

#### Test Case 6.1: Authentication
- [ ] Requests without token rejected (401)
- [ ] Invalid token rejected (403)
- [ ] Expired token rejected (403)
- [ ] Valid token accepted

#### Test Case 6.2: Authorization
- [ ] Non-admin cannot list reports (403)
- [ ] Non-admin cannot delete reports (403)
- [ ] Admin can perform all operations (200)
- [ ] Candidate can only view own reports

#### Test Case 6.3: Input Validation
- [ ] Invalid page number rejected
- [ ] Invalid limit rejected
- [ ] Invalid format rejected
- [ ] Missing required fields rejected

#### Test Case 6.4: File Security
- [ ] No directory traversal possible
- [ ] Files not accessible without auth
- [ ] File permissions correct
- [ ] No sensitive data exposed

### 7. Performance Testing

#### Test Case 7.1: Load Test
```bash
# Generate 100 concurrent requests
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports"

# ✓ Verify: Response time < 500ms
# ✓ Verify: No 5xx errors
# ✓ Verify: All requests complete
```

#### Test Case 7.2: Memory Usage
- [ ] Monitor memory during generation
- [ ] Check for memory leaks
- [ ] Cache not consuming excessive memory
- [ ] Clean shutdown

#### Test Case 7.3: Database Performance
- [ ] Queries use indexes
- [ ] Aggregation pipeline efficient
- [ ] No N+1 queries
- [ ] Query execution < 1s

### 8. Error Handling Testing

#### Test Case 8.1: Missing Data
- [ ] Interview not found → 404
- [ ] Candidate deleted → Handled gracefully
- [ ] Missing scores → N/A displayed
- [ ] Empty answers → Handled properly

#### Test Case 8.2: File System Errors
- [ ] Disk full → Proper error message
- [ ] Permission denied → Logged and reported
- [ ] Directory not writable → Directory created
- [ ] File already exists → Handled with unique name

#### Test Case 8.3: Database Errors
- [ ] Connection lost → Retry mechanism
- [ ] Query timeout → Proper error
- [ ] Invalid data → Validation error
- [ ] Duplicate entry → Handled appropriately

### 9. Frontend Integration Testing

#### Test Case 9.1: Report List
- [ ] Reports display in table
- [ ] Filters work correctly
- [ ] Pagination functional
- [ ] Search works

#### Test Case 9.2: Report Download
- [ ] Download button visible
- [ ] PDF downloads successfully
- [ ] File opens properly
- [ ] No 404 errors

#### Test Case 9.3: Export Functionality
- [ ] Export buttons visible
- [ ] CSV export works
- [ ] Excel export works
- [ ] Files download with correct names

#### Test Case 9.4: Archive/Delete
- [ ] Archive button functional
- [ ] Delete button functional
- [ ] Confirmations shown
- [ ] UI updates after action

### 10. Data Validation Testing

#### Test Case 10.1: Score Validation
```javascript
// Verify scores are clamped 0-100
validateScores({
  technical: 150,  // Should clamp to 100
  communication: -10,  // Should clamp to 0
  confidence: 75   // Valid
})
```

#### Test Case 10.2: Text Sanitization
```javascript
// Verify special characters handled
sanitizeReportData({
  candidate: {
    name: "<script>alert('xss')</script>"  // Should escape
  }
})
```

## Load Test Results Template

```
Date: ________________
Tester: ________________
Environment: ________________

Test: GET /api/reports
- Concurrent Users: 10
- Total Requests: 100
- Response Time (avg): ______ ms
- Response Time (max): ______ ms
- Error Rate: ______ %
- Pass/Fail: ____

Test: PDF Generation
- Time to Generate (avg): ______ ms
- File Size (avg): ______ KB
- CPU Usage Peak: ______ %
- Memory Usage Peak: ______ MB
- Pass/Fail: ____

Test: Export Operations
- CSV Generation Time: ______ ms
- Excel Generation Time: ______ ms
- File Sizes: CSV ______ KB, Excel ______ KB
- Pass/Fail: ____
```

## Sign-Off Checklist

- [ ] All test cases passed
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Error handling tested
- [ ] Frontend integration works
- [ ] Documentation complete
- [ ] Deployment guide reviewed
- [ ] Backup/Recovery tested
- [ ] Monitoring configured
- [ ] Team trained

## Launch Verification

**Pre-Launch (24 hours before):**
- [ ] Database backed up
- [ ] All services running
- [ ] Logs rotating properly
- [ ] Monitoring alerts configured

**Launch Day:**
- [ ] Deploy to production
- [ ] Verify endpoints responsive
- [ ] Monitor error rates
- [ ] Check cache performance
- [ ] Verify reports generating

**Post-Launch (24 hours after):**
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify cache effectiveness
- [ ] Confirm all operations working

---

**Approval Sign-Off:**

QA Lead: ______________ Date: __________

Dev Lead: ______________ Date: __________

DevOps: ______________ Date: __________
