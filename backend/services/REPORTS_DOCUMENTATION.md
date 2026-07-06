# Report System Documentation - Production Level

## Overview
The AI-Powered Resume Competency Verification System includes a comprehensive, production-grade report generation and management system. This document outlines all features, API endpoints, and best practices.

## Features

### 1. PDF Report Generation
- **Multi-page professional PDF reports** with dynamic formatting
- **Score visualization** with color-coded progress bars
- **Executive summary** with key metrics
- **Detailed competency analysis** with scores breakdown
- **Resume intelligence** extraction and display
- **Integrity checks** for exam proctoring
- **Interview Q&A analysis** with pagination support
- **Report metadata** and integrity hashing

### 2. Report Caching
- **In-memory caching** with 30-minute TTL
- **Automatic cache invalidation** on report updates/deletes
- **List-level caching** for filtered queries
- **Cache statistics** and monitoring

### 3. Report Export
- **CSV export** for bulk reports and single reports
- **Excel (XLSX) export** with formatted columns and widths
- **Automatic cleanup** of old export files
- **Support for custom field mapping**

### 4. Report Archiving
- **Report archiving** for compliance and data management
- **Archive status tracking**
- **Report restoration** capability
- **Archive statistics** and monitoring

### 5. Advanced Analytics
- **Detailed strength analysis** with multi-level thresholds
- **Comprehensive improvement recommendations**
- **Risk level assessment** (Low, Medium, High, Critical)
- **Performance trend analysis**
- **Comparative insights** and benchmarking

## API Endpoints

### Get All Reports
```
GET /api/reports
Query Parameters:
  - search: string (filters by candidate name or email)
  - recommendation: string (STRONG_HIRE, HIRE, HOLD, REJECT, All)
  - status: string (completed, hire, hold, reject, All)
  - page: number (default: 1)
  - limit: number (default: 10, max: 100)

Response:
{
  success: boolean,
  message: string,
  data: {
    reports: [],
    pagination: {
      page: number,
      limit: number,
      totalRecords: number,
      totalPages: number,
      hasNextPage: boolean,
      hasPreviousPage: boolean
    },
    filters: {}
  }
}
```

### Generate PDF Report
```
GET /api/reports/:id
Parameters:
  - id: Interview ID

Response: PDF file download
```

### Export Reports
```
GET /api/reports/export
Query Parameters:
  - format: string (csv or xlsx)

Response: CSV or Excel file download
```

### Archive Report
```
PUT /api/reports/:id/archive
Parameters:
  - id: Interview ID

Response:
{
  success: boolean,
  message: string
}
```

### Delete Report
```
DELETE /api/reports/:id
Parameters:
  - id: Interview ID

Response:
{
  success: boolean,
  message: string
}
```

### Get Archive Statistics
```
GET /api/reports/archive/stats

Response:
{
  success: boolean,
  data: {
    totalArchived: number,
    archiveSize: number
  }
}
```

## Services

### pdfReportService.js
**Main Responsibility:** PDF report generation with advanced formatting

**Key Functions:**
- `generatePDFReport(reportData, reportName)` - Generates professional multi-page PDF

**Features:**
- Page headers and footers
- Dynamic page breaks based on content
- Color-coded score visualization
- Integrity check formatting
- Report metadata inclusion

### reportAnalyticsService.js
**Main Responsibility:** Detailed analysis and insights generation

**Key Functions:**
- `generateReportAnalytics(interview)` - Generates comprehensive analytics

**Returns:**
- Strengths (multi-level with thresholds)
- Improvements (detailed recommendations)
- Risk level assessment
- Performance trends
- Comparative insights

### reportCachingService.js
**Main Responsibility:** In-memory caching with auto-invalidation

**Key Functions:**
- `getCachedReport(reportId)` - Retrieves cached report
- `setCachedReport(reportId, data)` - Caches report
- `getCachedReportList(filters)` - Retrieves cached list
- `invalidateReportCache(reportId)` - Clears single report cache
- `invalidateAllListCaches()` - Clears all list caches
- `getCacheStats()` - Returns cache statistics

### reportExportService.js
**Main Responsibility:** Multi-format export functionality

**Key Functions:**
- `exportReportsToCSV(reports, fileName)` - Exports to CSV
- `exportReportsToExcel(reports, fileName)` - Exports to Excel
- `exportSingleReportToCSV(report, fileName)` - Single report CSV
- `cleanOldExports(maxAgeHours)` - Cleanup old files

### reportArchivingService.js
**Main Responsibility:** Report archiving and restoration

**Key Functions:**
- `archiveReport(reportId)` - Archives a report
- `isReportArchived(reportId)` - Checks if report is archived
- `restoreReport(reportId)` - Restores archived report
- `getArchiveStats()` - Returns archive statistics
- `bulkArchiveOldReports(reportIds, daysOld)` - Bulk archiving

### reportValidationService.js
**Main Responsibility:** Data validation and security

**Key Functions:**
- `validateReportData(data)` - Validates report structure
- `validateFilters(filters)` - Validates query filters
- `sanitizeReportData(data)` - Sanitizes sensitive data
- `checkReportPermission(user, report, action)` - Permission checks

## Error Handling

All services include comprehensive error handling:

```javascript
try {
  // Operation
} catch (error) {
  console.error("Operation Error:", error);
  // Return structured error response
}
```

## Security Features

1. **Authentication:** All endpoints require authentication via JWT
2. **Authorization:** Admin-only endpoints verified
3. **Data Validation:** All inputs validated and sanitized
4. **File Handling:** Secure file creation and deletion
5. **Report Integrity:** Hash-based integrity verification
6. **Permission Checks:** User-level access control

## Performance Optimizations

1. **Caching:** 30-minute TTL for frequently accessed reports
2. **Aggregation Pipeline:** Optimized MongoDB queries
3. **Pagination:** Prevents large dataset transfers
4. **Lazy Loading:** Optional data fields loaded on demand
5. **Background Cleanup:** Scheduled old file deletion

## Best Practices

### Generating Reports
```javascript
// Ensure reportData is properly structured
const reportData = buildCandidateReport(interview);
const filePath = await generatePDFReport(
  reportData,
  `report-${interview._id}`
);
```

### Caching Reports
```javascript
// Check cache first
const cached = getCachedReport(reportId);
if (cached) return cached;

// Generate and cache
const report = await generateReport(reportId);
setCachedReport(reportId, report);
```

### Exporting Data
```javascript
// Use appropriate format based on user preference
const filePath = await exportReportsToExcel(
  reports,
  "monthly-export"
);
```

### Archiving Reports
```javascript
// Archive old reports for compliance
await archiveReport(reportId);
// Or bulk archive
await bulkArchiveOldReports(oldReportIds, 90);
```

## Configuration

### Cache Settings (reportCachingService.js)
```javascript
const cache = new NodeCache({
  stdTTL: 1800,      // 30 minutes
  checkperiod: 600,  // Check every 10 minutes
});
```

### Export Cleanup (reportExportService.js)
```javascript
// Clean files older than 24 hours
cleanOldExports(24);
```

## Monitoring & Maintenance

### Cache Stats
```javascript
const stats = getCacheStats();
// Returns: {keys: number, kv: object, hits: number, misses: number}
```

### Archive Stats
```javascript
const stats = getArchiveStats();
// Returns: {totalArchived: number, archiveSize: number}
```

### File Locations
- Reports: `backend/reports/`
- Archives: `backend/archives/`
- Exports: `backend/exports/`

## Troubleshooting

### Report Generation Fails
1. Check interview data exists in database
2. Verify reportData structure is valid
3. Check file system permissions
4. Ensure pdfkit is properly installed

### Caching Issues
1. Clear cache: `clearAllCache()`
2. Check cache stats: `getCacheStats()`
3. Verify TTL settings

### Export Failures
1. Ensure json2csv and xlsx dependencies installed
2. Check export directory permissions
3. Verify report data is properly formatted

## Future Enhancements

1. **Email Delivery** - Automated report email
2. **Scheduling** - Scheduled report generation
3. **Templates** - Customizable PDF templates
4. **Analytics Dashboard** - Real-time report analytics
5. **Version Control** - Report versioning system
6. **Report Sharing** - Secure report sharing links

## Dependencies

```json
{
  "json2csv": "^6.0.0",
  "node-cache": "^5.1.2",
  "pdfkit": "^0.18.0",
  "xlsx": "^0.18.5"
}
```

## Version History

- **v1.0.0** (Current) - Production release with full feature set
  - PDF generation with advanced formatting
  - Caching system
  - Multi-format exports
  - Report archiving
  - Advanced analytics
  - Comprehensive validation
