const Report = require('../models/Report');
const User = require('../models/User');
const logAction = require('../utils/logger');

exports.assignReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { assignedTo } = req.body; // Admin to whom the report is assigned

    // Ensure only admins can assign reports
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Only admins can assign reports.' });
    }

    // Validate report existence
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Validate if assignedTo is an admin
    const assignedAdmin = await User.findById(assignedTo);
    if (!assignedAdmin || assignedAdmin.role !== 'admin') {
      return res.status(400).json({ message: 'Invalid admin ID.' });
    }

    // Assign report
    report.assignedTo = assignedTo;
    await report.save();

    // Log action and return response
    await logAction('Report Assigned', req.user.id, {
      reportId: reportId,
      assignedTo: assignedAdmin.id,
    });

    res.json({
      message: `Report assigned to ${assignedAdmin.fullName.split(' ')[0]}.`,
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
