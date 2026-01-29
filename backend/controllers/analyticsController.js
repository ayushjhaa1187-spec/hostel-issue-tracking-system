const Issue = require('../models/Issue');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const LostItem = require('../models/LostItem');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private (Staff only)
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Date filtering
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const filter = startDate || endDate ? { createdAt: dateFilter } : {};
    
    // Get counts
    const totalIssues = await Issue.countDocuments(filter);
    const openIssues = await Issue.countDocuments({ ...filter, status: 'open' });
    const resolvedIssues = await Issue.countDocuments({ ...filter, status: 'resolved' });
    const totalUsers = await User.countDocuments();
    const totalLostItems = await LostItem.countDocuments(filter);
    
    // Calculate average resolution time
    const resolvedWithTime = await Issue.find({
      ...filter,
      status: 'resolved',
      'timestamps.resolvedAt': { $exists: true }
    });
    
    let avgResolutionTime = 0;
    if (resolvedWithTime.length > 0) {
      const totalTime = resolvedWithTime.reduce((sum, issue) => {
        const created = issue.timestamps?.createdAt || issue.createdAt;
        const resolved = issue.timestamps?.resolvedAt;
        return sum + (resolved - created);
      }, 0);
      avgResolutionTime = Math.round(totalTime / resolvedWithTime.length / (1000 * 60 * 60)); // hours
    }
    
    // SLA compliance rate
    const slaCompliant = await Issue.countDocuments({ ...filter, 'sla.slaCompliant': true });
    const slaRate = totalIssues > 0 ? Math.round((slaCompliant / totalIssues) * 100) : 0;
    
    res.json({
      success: true,
      data: {
        totalIssues,
        openIssues,
        resolvedIssues,
        totalUsers,
        totalLostItems,
        avgResolutionTime,
        slaComplianceRate: slaRate
      }
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get issues by status breakdown
// @route   GET /api/analytics/issues-by-status
// @access  Private (Staff only)
exports.getIssuesByStatus = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const matchFilter = startDate || endDate ? { createdAt: dateFilter } : {};
    
    const statusBreakdown = await Issue.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.json({
      success: true,
      data: statusBreakdown
    });
  } catch (error) {
    console.error('Issues by status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get resolution time trends
// @route   GET /api/analytics/resolution-trends
// @access  Private (Staff only)
exports.getResolutionTrends = async (req, res) => {
  try {
    const { period = 'week' } = req.query; // day, week, month
    
    const periodMap = {
      day: { $dayOfMonth: '$timestamps.createdAt' },
      week: { $week: '$timestamps.createdAt' },
      month: { $month: '$timestamps.createdAt' }
    };
    
    const groupPeriod = periodMap[period] || periodMap.week;
    
    const trends = await Issue.aggregate([
      {
        $match: {
          status: 'resolved',
          'timestamps.resolvedAt': { $exists: true }
        }
      },
      {
        $project: {
          period: groupPeriod,
          resolutionTime: {
            $divide: [
              { $subtract: ['$timestamps.resolvedAt', '$timestamps.createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: '$period',
          avgResolutionTime: { $avg: '$resolutionTime' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          period: '$_id',
          avgResolutionTime: { $round: ['$avgResolutionTime', 2] },
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Resolution trends error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get category breakdown
// @route   GET /api/analytics/category-breakdown
// @access  Private (Staff only)
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const categoryBreakdown = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'resolved'] },
                {
                  $divide: [
                    { $subtract: ['$timestamps.resolvedAt', '$timestamps.createdAt'] },
                    1000 * 60 * 60
                  ]
                },
                null
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          category: '$_id',
          count: 1,
          resolved: 1,
          resolutionRate: {
            $round: [{ $multiply: [{ $divide: ['$resolved', '$count'] }, 100] }, 2]
          },
          avgResolutionTime: { $round: ['$avgResolutionTime', 2] },
          _id: 0
        }
      }
    ]);
    
    res.json({
      success: true,
      data: categoryBreakdown
    });
  } catch (error) {
    console.error('Category breakdown error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get staff performance metrics
// @route   GET /api/analytics/staff-performance
// @access  Private (Admin only)
exports.getStaffPerformance = async (req, res) => {
  try {
    // Get all staff members
    const staffMembers = await User.find({ role: { $in: ['staff', 'admin'] } });
    
    const performanceData = await Promise.all(
      staffMembers.map(async (staff) => {
        // Issues assigned to staff
        const assignedIssues = await Issue.countDocuments({ assignedTo: staff._id });
        const resolvedIssues = await Issue.countDocuments({
          assignedTo: staff._id,
          status: 'resolved'
        });
        
        // Calculate average response time
        const issuesWithResponse = await Issue.find({
          assignedTo: staff._id,
          'timestamps.firstResponseAt': { $exists: true }
        });
        
        let avgResponseTime = 0;
        if (issuesWithResponse.length > 0) {
          const totalResponseTime = issuesWithResponse.reduce((sum, issue) => {
            const created = issue.timestamps?.createdAt || issue.createdAt;
            const firstResponse = issue.timestamps?.firstResponseAt;
            return sum + (firstResponse - created);
          }, 0);
          avgResponseTime = Math.round(totalResponseTime / issuesWithResponse.length / (1000 * 60)); // minutes
        }
        
        // Calculate resolution rate
        const resolutionRate = assignedIssues > 0
          ? Math.round((resolvedIssues / assignedIssues) * 100)
          : 0;
        
        return {
          staffId: staff._id,
          name: staff.name,
          email: staff.email,
          assignedIssues,
          resolvedIssues,
          resolutionRate,
          avgResponseTime
        };
      })
    );
    
    // Sort by resolution rate
    performanceData.sort((a, b) => b.resolutionRate - a.resolutionRate);
    
    res.json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    console.error('Staff performance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Export analytics report (CSV/JSON)
// @route   GET /api/analytics/export-report
// @access  Private (Staff only)
exports.exportReport = async (req, res) => {
  try {
    const { format = 'json', reportType = 'summary' } = req.query;
    
    let reportData = {};
    
    switch (reportType) {
      case 'summary':
        // Get summary data
        const summary = await exports.getAnalyticsSummary(req, { json: () => {} });
        reportData = summary;
        break;
      
      case 'issues':
        // Get all issues with details
        reportData = await Issue.find()
          .populate('reportedBy', 'name email')
          .populate('assignedTo', 'name email')
          .select('-__v')
          .lean();
        break;
      
      case 'performance':
        // Get staff performance
        const performance = await exports.getStaffPerformance(req, { json: () => {} });
        reportData = performance;
        break;
      
      default:
        return res.status(400).json({ success: false, message: 'Invalid report type' });
    }
    
    if (format === 'csv') {
      // Convert JSON to CSV format
      const csvData = convertToCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${reportType}-report.csv`);
      res.send(csvData);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: reportData,
        exportedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to convert JSON to CSV
function convertToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

module.exports = exports;
