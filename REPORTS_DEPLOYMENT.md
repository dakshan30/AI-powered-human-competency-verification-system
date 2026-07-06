# Reports System - Production Deployment Guide

## Pre-Deployment Checklist

### Backend Setup
- [ ] Install dependencies: `npm install`
- [ ] Verify required packages:
  - `pdfkit` - PDF generation
  - `json2csv` - CSV export
  - `xlsx` - Excel export
  - `node-cache` - Caching

- [ ] Create environment variables:
  ```
  NODE_ENV=production
  MONGODB_URI=<production-uri>
  JWT_SECRET=<secure-secret>
  PORT=5000
  ```

- [ ] Initialize reports directories:
  ```
  backend/reports/
  backend/archives/
  backend/exports/
  ```

### Frontend Setup
- [ ] Update API endpoints to production URL
- [ ] Build production bundle: `npm run build`
- [ ] Test report download functionality
- [ ] Test export functionality

## Installation Steps

### 1. Backend Dependencies
```bash
cd backend
npm install json2csv xlsx node-cache
```

### 2. Database Preparation
- Ensure MongoDB connection is established
- Create indexes for reports collection:
```javascript
db.interviews.createIndex({ status: 1 })
db.interviews.createIndex({ completedAt: -1 })
db.interviews.createIndex({ candidate: 1 })
```

### 3. File System Setup
Create required directories:
```bash
mkdir -p backend/reports
mkdir -p backend/archives
mkdir -p backend/exports
```

Set proper permissions:
```bash
chmod 755 backend/reports
chmod 755 backend/archives
chmod 755 backend/exports
```

### 4. Start Application
```bash
cd backend
npm start
```

The system will automatically initialize on startup.

## Configuration

### PDF Report Settings
File: `backend/services/pdfReportService.js`

Key settings:
- Page margins: 50px
- Font: Helvetica
- Color scheme: Dark blue (#0F172A)
- Footer on each page: Enabled

### Cache Settings
File: `backend/services/reportCachingService.js`

```javascript
const cache = new NodeCache({
  stdTTL: 1800,      // 30 minutes
  checkperiod: 600,  // 10 minutes
});
```

To adjust:
- Increase `stdTTL` for longer cache duration
- Decrease `checkperiod` for more frequent cleanup

### Export Settings
File: `backend/services/reportExportService.js`

- Auto-cleanup: Deletes files older than 24 hours
- Format support: CSV and XLSX
- Column mapping: Customizable in export functions

### Archive Settings
File: `backend/services/reportArchivingService.js`

- Archive storage: `backend/archives/`
- Metadata format: JSON
- Bulk archive: Supports processing multiple reports

## API Endpoints

### Production Endpoints

#### Get Reports
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://api.yourdomain.com/api/reports?page=1&limit=10"
```

#### Download PDF
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://api.yourdomain.com/api/reports/:id" \
  -o report.pdf
```

#### Export to CSV
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://api.yourdomain.com/api/reports/export?format=csv" \
  -o reports.csv
```

#### Export to Excel
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://api.yourdomain.com/api/reports/export?format=xlsx" \
  -o reports.xlsx
```

#### Archive Report
```bash
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  "http://api.yourdomain.com/api/reports/:id/archive"
```

#### Delete Report
```bash
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  "http://api.yourdomain.com/api/reports/:id"
```

## Performance Optimization

### 1. Database Indexing
```javascript
// Create these indexes for optimal performance
db.interviews.createIndex({ "status": 1, "completedAt": -1 })
db.interviews.createIndex({ "candidate": 1, "status": 1 })
db.interviews.createIndex({ "overallScores.competency": 1 })
```

### 2. Caching Strategy
- Reports are cached for 30 minutes
- List queries cached separately
- Manual invalidation on updates
- Monitor cache hits/misses

### 3. Query Optimization
- Use aggregation pipeline for large datasets
- Implement pagination (default 10 items)
- Lazy-load optional fields

### 4. File Management
- Automatic export cleanup (24-hour retention)
- Archive old reports regularly
- Monitor disk space usage

## Monitoring

### Health Check Endpoint
```bash
curl "http://api.yourdomain.com/api/health"
```

### Cache Monitoring
```javascript
// In Node.js console
const reportCache = require('./services/reportCachingService');
console.log(reportCache.getCacheStats());
```

### Archive Monitoring
```javascript
// Get archive statistics
const archiveService = require('./services/reportArchivingService');
console.log(archiveService.getArchiveStats());
```

### Log Monitoring
Monitor these log patterns:
- `[ERROR]` - Critical errors
- `[WARN]` - Warnings that need attention
- `[Cache]` - Cache operations
- `[Archive]` - Archive operations

## Security Considerations

### 1. Authentication
- All endpoints require valid JWT token
- Token should be in Authorization header
- Refresh tokens every 24 hours

### 2. Authorization
- Only admins can access report lists
- Candidates can only view their own reports
- Delete/Archive operations require admin role

### 3. File Security
- Sanitize file names
- Validate file types
- Set appropriate file permissions
- Use random suffixes for uniqueness

### 4. Data Validation
- Validate all input parameters
- Sanitize database queries
- Check file size limits (50MB max)

## Backup and Recovery

### Backup Strategy

#### Daily Backup
```bash
# Backup reports
tar -czf reports-backup-$(date +%Y%m%d).tar.gz backend/reports/

# Backup archives
tar -czf archives-backup-$(date +%Y%m%d).tar.gz backend/archives/
```

#### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://user:pass@host:port/dbname" \
  --out=./backups/$(date +%Y%m%d)
```

### Recovery Procedures

#### Restore Reports
```bash
tar -xzf reports-backup-20240101.tar.gz -C backend/
```

#### Restore Database
```bash
mongorestore --uri="mongodb://user:pass@host:port/dbname" \
  ./backups/20240101
```

## Troubleshooting

### Issue: Reports not generating
**Solution:**
1. Check file system permissions
2. Verify MongoDB connection
3. Check disk space availability
4. Review error logs

### Issue: Cache not working
**Solution:**
1. Restart application
2. Clear cache: `clearAllCache()`
3. Check Node.js memory
4. Verify cache settings

### Issue: Export files not created
**Solution:**
1. Check export directory permissions
2. Verify json2csv/xlsx installation
3. Check available disk space
4. Validate report data

### Issue: Slow report generation
**Solution:**
1. Check database indexes
2. Enable caching
3. Optimize PDF generation
4. Monitor server resources

## Scheduled Tasks

### Set up cron jobs (Linux/Mac):

```bash
# Daily cleanup of old exports (runs at 2 AM)
0 2 * * * cd /path/to/backend && node -e "require('./services/reportExportService').cleanOldExports(24)"

# Daily archive old reports (runs at 3 AM)
0 3 * * * cd /path/to/backend && node -e "require('./services/reportArchivingService').bulkArchiveOldReports([], 90)"

# Cache statistics report (runs daily)
0 6 * * * cd /path/to/backend && node -e "const cache = require('./services/reportCachingService'); console.log(cache.getCacheStats())"
```

## Scaling Considerations

### For high-volume environments:

1. **Increase Cache TTL**
   - Adjust `stdTTL` for longer cache periods
   - Monitor hit rates

2. **Implement Redis Cache**
   - Replace node-cache with Redis
   - Share cache across multiple instances

3. **Database Optimization**
   - Add read replicas
   - Implement connection pooling
   - Use sharding for large datasets

4. **File Storage**
   - Consider cloud storage (S3, etc.)
   - Implement CDN for report downloads
   - Archive to cold storage

## Support

For issues or questions:
1. Check REPORTS_DOCUMENTATION.md
2. Review logs in `backend/reports/`
3. Contact development team
4. Create issue with error logs

---

**Last Updated:** 2024-07-06
**Version:** 1.0.0
