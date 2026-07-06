/*
====================================
REPORT CACHING SERVICE
====================================
*/

const NodeCache =
  require("node-cache");

/*
CACHE INSTANCE
Standard TTL: 30 minutes
Check period: 10 minutes
*/

const cache =
  new NodeCache({
    stdTTL: 1800,
    checkperiod: 600,
  });

/*
====================================
CACHE KEYS
====================================
*/

const getCacheKey =
  (key) =>
    `report:${key}`;

const getReportListKey =
  (filters) =>
    `report:list:${JSON.stringify(
      filters
    )}`;

/*
====================================
GET CACHED REPORT
====================================
*/

exports.getCachedReport =
  (reportId) => {
    try {
      const key =
        getCacheKey(
          reportId
        );

      return cache.get(key);
    } catch (
      error
    ) {
      console.error(
        "Cache get error:",
        error
      );

      return null;
    }
  };

/*
====================================
SET REPORT CACHE
====================================
*/

exports.setCachedReport =
  (reportId, data) => {
    try {
      const key =
        getCacheKey(
          reportId
        );

      cache.set(key, data);

      return true;
    } catch (
      error
    ) {
      console.error(
        "Cache set error:",
        error
      );

      return false;
    }
  };

/*
====================================
GET CACHED REPORT LIST
====================================
*/

exports.getCachedReportList =
  (filters) => {
    try {
      const key =
        getReportListKey(
          filters
        );

      return cache.get(key);
    } catch (
      error
    ) {
      console.error(
        "Cache list get error:",
        error
      );

      return null;
    }
  };

/*
====================================
SET REPORT LIST CACHE
====================================
*/

exports.setCachedReportList =
  (filters, data) => {
    try {
      const key =
        getReportListKey(
          filters
        );

      cache.set(key, data);

      return true;
    } catch (
      error
    ) {
      console.error(
        "Cache list set error:",
        error
      );

      return false;
    }
  };

/*
====================================
INVALIDATE REPORT CACHE
====================================
*/

exports.invalidateReportCache =
  (reportId) => {
    try {
      const key =
        getCacheKey(
          reportId
        );

      cache.del(key);

      return true;
    } catch (
      error
    ) {
      console.error(
        "Cache invalidate error:",
        error
      );

      return false;
    }
  };

/*
====================================
INVALIDATE ALL REPORT LIST CACHES
====================================
*/

exports.invalidateAllListCaches =
  () => {
    try {
      const keys =
        cache.keys();

      keys.forEach(
        (key) => {
          if (
            key.includes(
              "report:list:"
            )
          ) {
            cache.del(key);
          }
        }
      );

      return true;
    } catch (
      error
    ) {
      console.error(
        "Cache invalidate all error:",
        error
      );

      return false;
    }
  };

/*
====================================
GET CACHE STATS
====================================
*/

exports.getCacheStats =
  () => cache.getStats();

/*
====================================
CLEAR ALL CACHE
====================================
*/

exports.clearAllCache =
  () => {
    try {
      cache.flushAll();

      return true;
    } catch (
      error
    ) {
      console.error(
        "Cache flush error:",
        error
      );

      return false;
    }
  };
