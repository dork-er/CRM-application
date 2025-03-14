const Report = require('../models/Report');
const ReportResponse = require('../models/ReportResponse');

// Function to get dashboard statistics
exports.getDashboardReportStats = async (req, res) => {
  try {
    // 1. Total number of reports
    const totalReports = await Report.countDocuments();

    // 2. Reports grouped by status
    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 3. Reports grouped by priority
    const reportsByPriority = await Report.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // 4. Calculate average response time (time difference between report creation and first admin response)
    const responseTimes = await ReportResponse.aggregate([
      {
        $lookup: {
          from: 'reports',
          localField: 'reportId',
          foreignField: '_id',
          as: 'reportDetails',
        },
      },
      { $unwind: '$reportDetails' },
      {
        $project: {
          responseTime: {
            $subtract: ['$timestamp', '$reportDetails.createdAt'],
          },
        },
      },
    ]);

    let avgResponseTime = 0;
    if (responseTimes.length > 0) {
      const totalResponseTime = responseTimes.reduce(
        (sum, res) => sum + res.responseTime,
        0
      );
      avgResponseTime = totalResponseTime / responseTimes.length;
    }

    res.status(200).json({
      totalReports,
      reportsByStatus,
      reportsByPriority,
      averageResponseTime: avgResponseTime
        ? `${(avgResponseTime / (1000 * 60)).toFixed(2)} minutes`
        : 'No responses yet',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
