const express = require('express');
const router = express.Router();
const {
  getAnalyticsSummary,
  getIssuesByStatus,
  getResolutionTrends,
  getCategoryBreakdown,
  getStaffPerformance,
  exportReport
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// All analytics routes are restricted to staff/admin
router.use(protect);
router.use(authorize('staff', 'admin'));

router.get('/summary', getAnalyticsSummary);
router.get('/issues-by-status', getIssuesByStatus);
router.get('/resolution-trends', getResolutionTrends);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/staff-performance', getStaffPerformance);
router.get('/export', exportReport);

module.exports = router;
