# Reports System - Installation & Verification Checklist

## Pre-Installation Verification

### Code Review
- [ ] All new service files created
  - [ ] `backend/services/reportArchivingService.js`
  - [ ] `backend/services/reportCachingService.js`
  - [ ] `backend/services/reportExportService.js`
  - [ ] `backend/services/reportValidationService.js`
  - [ ] `backend/services/REPORTS_DOCUMENTATION.md`

- [ ] All utility files created
  - [ ] `backend/utils/initializeReportsSystem.js`
  - [ ] `backend/utils/reportHelpers.js`

- [ ] Modified files verified
  - [ ] `backend/services/pdfReportService.js` (enhanced)
  - [ ] `backend/services/reportAnalyticsService.js` (enhanced)
  - [ ] `backend/controllers/reportController.js` (new endpoints)
  - [ ] `backend/routes/reportRoutes.js` (new routes)
  - [ ] `backend/server.js` (initialization added)
  - [ ] `backend/package.json` (dependencies added)
  - [ ] `frontend/src/services/reportService.js` (new functions)

- [ ] Documentation files created
  - [ ] `REPORTS_SUMMARY.md`
  - [ ] `REPORTS_DOCUMENTATION.md`
  - [ ] `REPORTS_DEPLOYMENT.md`
  - [ ] `REPORTS_TESTING.md`
  - [ ] `REPORTS_INSTALLATION.md` (this file)

## Installation Steps

### Step 1: Dependencies Installation
```bash
cd backend
npm install
```

- [ ] Command executed successfully
- [ ] No error messages
- [ ] Packages installed:
  - [ ] `json2csv ^6.0.0`
  - [ ] `node-cache ^5.1.2`
  - [ ] `xlsx ^0.18.5`
  - [ ] `pdfkit` (already present)

**Verify:**
```bash
npm list json2csv node-cache xlsx
```

### Step 2: Database Setup

#### Create Indices
```javascript
// Connect to MongoDB and run:
use yourdbname

db.interviews.createIndex({ status: 1, completedAt: -1 })
db.interviews.createIndex({ candidate: 1, status: 1 })
db.interviews.createIndex({ completedAt: -1 })
```

- [ ] Indices created successfully
- [ ] MongoDB connection verified

### Step 3: Directory Structure

#### Verify Automatic Creation
The system creates directories automatically on startup, but you can verify manually:

```bash
# Backend root
cd backend

# These will be created automatically:
# - reports/
# - archives/
# - exports/
```

**Verify After Starting App:**
```bash
ls -la reports/
ls -la archives/
ls -la exports/
```

- [ ] `reports/` directory exists and readable
- [ ] `archives/` directory exists and readable
- [ ] `exports/` directory exists and readable

#### Set Permissions
```bash
chmod 755 backend/reports
chmod 755 backend/archives
chmod 755 backend/exports
```

- [ ] Permissions set to 755 (rwxr-xr-x)
- [ ] Owner is correct user/process

### Step 4: Environment Configuration

#### Required Variables (.env)
```bash
NODE_ENV=production
MONGODB_URI=mongodb://user:pass@host:port/dbname
JWT_SECRET=your-secret-key
PORT=5000
```

- [ ] `.env` file created/updated
- [ ] All variables set correctly
- [ ] No secrets in git repository

### Step 5: Application Startup

#### Start Backend
```bash
npm start
```

**Expected Output:**
```
✓ Created reports directory
✓ reports directory exists
✓ Created archives directory
✓ archives directory exists
✓ Created exports directory
✓ exports directory exists
✓ Reports system initialized successfully!
```

- [ ] Application starts without errors
- [ ] Initialization messages displayed
- [ ] Server listening on correct port
- [ ] Database connected

#### Test Server Health
```bash
curl http://localhost:5000/
```

Expected response: API is running message

- [ ] Server responds
- [ ] No connection errors

## Functional Verification

### Test 1: Report Listing
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/reports?page=1&limit=10
```

**Expected:**
- [ ] 200 OK status
- [ ] Reports array returned
- [ ] Pagination info present
- [ ] No authentication errors

### Test 2: PDF Generation
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/reports/INTERVIEW_ID \
  -o test-report.pdf
```

**Expected:**
- [ ] 200 OK status
- [ ] PDF file downloaded
- [ ] File size > 50KB
- [ ] File opens correctly

**Verify PDF Content:**
- [ ] Header present with title
- [ ] Executive summary section
- [ ] Score breakdown
- [ ] Page numbers visible
- [ ] Footer on each page

### Test 3: CSV Export
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/reports/export?format=csv" \
  -o reports.csv
```

**Expected:**
- [ ] 200 OK status
- [ ] CSV file downloaded
- [ ] File opens in Excel/Sheets
- [ ] Headers present
- [ ] Data properly formatted

### Test 4: Excel Export
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/reports/export?format=xlsx" \
  -o reports.xlsx
```

**Expected:**
- [ ] 200 OK status
- [ ] XLSX file downloaded
- [ ] File opens in Excel
- [ ] Column widths reasonable
- [ ] Data properly formatted

### Test 5: Archive Report
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/reports/INTERVIEW_ID/archive
```

**Expected:**
- [ ] 200 OK status
- [ ] Success message
- [ ] Archive file created in `backend/archives/`

### Test 6: Delete Report
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/reports/INTERVIEW_ID
```

**Expected:**
- [ ] 200 OK status
- [ ] Success message
- [ ] Report removed from database

### Test 7: Archive Statistics
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/reports/archive/stats
```

**Expected:**
- [ ] 200 OK status
- [ ] totalArchived number
- [ ] archiveSize in bytes

## Security Verification

### Authentication Tests
- [ ] Request without token → 401 Unauthorized
- [ ] Invalid token → 403 Forbidden
- [ ] Expired token → 403 Forbidden
- [ ] Valid token → 200/correct response

**Test:**
```bash
# Without token (should fail)
curl http://localhost:5000/api/reports

# With invalid token (should fail)
curl -H "Authorization: Bearer invalid" \
  http://localhost:5000/api/reports
```

- [ ] Proper error responses

### Authorization Tests
- [ ] Non-admin cannot list reports → 403
- [ ] Non-admin cannot delete → 403
- [ ] Admin can do all operations → 200

### Input Validation Tests
- [ ] Invalid page → 400 Bad Request
- [ ] Invalid limit → 400 Bad Request
- [ ] Invalid format → 400 Bad Request

**Test:**
```bash
# Invalid page
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/reports?page=abc"

# Expected: 400 error
```

- [ ] All validations working

## Performance Verification

### Cache Performance
```javascript
// In Node console after request
const cache = require('./services/reportCachingService');
console.log(cache.getCacheStats());
```

Expected output:
```javascript
{
  keys: number,
  kv: object,
  hits: number,
  misses: number
}
```

- [ ] Cache has entries
- [ ] Hit count increasing on repeated requests
- [ ] Memory usage reasonable

### Response Times
```bash
# Time a report request
time curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/reports

# First request: 200-500ms (generates/fetches from DB)
# Subsequent requests: <50ms (from cache)
```

- [ ] First request < 1 second
- [ ] Cached requests < 100ms
- [ ] Consistent response times

### Load Test (Optional)
```bash
# Using Apache Bench
ab -n 100 -c 10 \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/reports
```

Expected: No errors, response time consistent

- [ ] Test completes successfully
- [ ] Error rate 0%
- [ ] Average response time acceptable

## Frontend Integration Verification

### Reports Page
- [ ] Reports table displays correctly
- [ ] Pagination controls work
- [ ] Filters (search, recommendation, status) work
- [ ] No console errors

### Download Functionality
- [ ] Download button visible
- [ ] PDF downloads on click
- [ ] File opens without errors
- [ ] No CORS errors

### Export Functionality
- [ ] Export CSV button works
- [ ] Export Excel button works
- [ ] Files download correctly
- [ ] Files open in respective applications

### Archive/Delete Functionality
- [ ] Archive button functional
- [ ] Delete button functional
- [ ] Confirmation dialogs appear
- [ ] Table updates after action

## File System Verification

### Directory Structure
```bash
backend/
├── reports/
│   └── report-*.pdf (generated files)
├── archives/
│   └── *-archive.json (metadata)
└── exports/
    └── *.csv or *.xlsx (temporary files)
```

- [ ] Structure as shown above
- [ ] File permissions: 755
- [ ] File ownership: correct user

### File Cleanup
- [ ] Export files auto-delete after 24 hours
- [ ] Old archives removed on request
- [ ] No orphaned files

**Verify:**
```bash
find backend/exports -type f -mtime +1 -ls
# Should show files older than 1 day (or none)
```

- [ ] Cleanup working

## Logging Verification

### Check Logs
```bash
# Monitor application logs
tail -f backend.log

# Should see:
# - Report generation messages
# - Cache operations
# - Archive operations
# - No ERROR messages
```

- [ ] Application logging configured
- [ ] No error messages
- [ ] Info messages present

### Log Rotation (if applicable)
- [ ] Log files rotate daily
- [ ] Old logs compressed/archived
- [ ] No disk space issues from logs

## Database Verification

### Collections
```javascript
// Connect and verify
db.interviews.findOne()
// Should return interview with populated data
```

- [ ] Interviews collection present
- [ ] Data structure correct
- [ ] Indices created:
  - [ ] `{ status: 1, completedAt: -1 }`
  - [ ] `{ candidate: 1, status: 1 }`
  - [ ] `{ completedAt: -1 }`

## Backup & Recovery Verification

### Backup Process
```bash
# Backup reports
tar -czf reports-backup.tar.gz backend/reports/

# Backup MongoDB
mongodump --uri="mongodb://..." --out=./backup
```

- [ ] Backup command executes
- [ ] Files backed up successfully
- [ ] Backup file readable

### Recovery Test (Optional)
```bash
# Extract backup to test location
tar -xzf reports-backup.tar.gz -C ./test/

# Verify files restored
ls -la ./test/backend/reports/
```

- [ ] Restore process works
- [ ] All files recovered
- [ ] Files readable

## Monitoring Setup

### Performance Monitoring
- [ ] Application monitoring tool configured
- [ ] CPU usage monitored
- [ ] Memory usage monitored
- [ ] Disk usage monitored

### Alert Configuration
- [ ] High memory alert (>500MB)
- [ ] Disk space alert (>90% full)
- [ ] Error rate alert (>0.1%)
- [ ] Response time alert (>2s)

### Logging Configuration
- [ ] Error logs to file
- [ ] Combined logs for analysis
- [ ] Log rotation configured
- [ ] Old logs archived

## Sign-Off & Deployment

### Development Sign-Off
- [ ] All features tested and working
- [ ] Code reviewed
- [ ] Documentation reviewed
- [ ] Performance acceptable
- [ ] Security verified

**Developer:** _________________ Date: _________

### QA Sign-Off
- [ ] Test cases passed
- [ ] Security testing complete
- [ ] Performance benchmarks met
- [ ] No known issues

**QA Lead:** _________________ Date: _________

### Operations Sign-Off
- [ ] Infrastructure ready
- [ ] Monitoring configured
- [ ] Backups tested
- [ ] Runbooks prepared

**DevOps:** _________________ Date: _________

---

## Post-Deployment Checklist

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify cache effectiveness
- [ ] Test all endpoints
- [ ] Check disk space usage

### First Week
- [ ] Review performance trends
- [ ] Check for any issues
- [ ] Verify backup process
- [ ] Monitor user feedback
- [ ] Review optimization opportunities

### Ongoing
- [ ] Daily log review
- [ ] Weekly performance review
- [ ] Monthly security audit
- [ ] Quarterly optimization review

---

## Support Contacts

**For Technical Issues:**
- Development Team: [contact info]
- DevOps Team: [contact info]

**For Documentation:**
- See REPORTS_*.md files in project root

**For Escalations:**
- Technical Lead: [contact info]

---

## References

1. REPORTS_SUMMARY.md - Complete overview
2. REPORTS_DOCUMENTATION.md - API & technical reference
3. REPORTS_DEPLOYMENT.md - Operations guide
4. REPORTS_TESTING.md - Test cases & procedures

---

**Installation & Verification Complete!** ✅

Your reports system is ready for production deployment.
