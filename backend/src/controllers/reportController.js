const Report = require('../models/Report');

//? USER CONTROLLER FUNCTIONS
//
// Submit a report (POST /api/reports/submit)
exports.submitReport = async (req, res) => {
  try {
    const { title, description, location, category, priority, attachments } =
      req.body;
    const coordinates = location?.coordinates;

    if (!title || !description || !coordinates || !category) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        message: 'Coordinates must be an array [longitude, latitude].',
      });
    }

    const report = new Report({
      user: req.user.id, // Extracted from the authentication middleware
      title,
      description,
      location: {
        type: 'Point',
        coordinates,
      },
      category,
      priority: priority || 'Medium',
      attachments: attachments || [],
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully.', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get report status (User & Admin) (GET /api/reports/status/:id)
exports.getReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // If user is not admin, ensure they can only access their own reports
    if (req.user.role !== 'admin' && report.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ status: report.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reports submitted by the logged-in user (GET /api/reports/my-reports)
exports.getPastReports = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const reports = await Report.find({ user: userId }).sort({ createdAt: -1 }); // Sort by newest first

    if (!reports.length) {
      return res.status(404).json({ message: 'No reports found' });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get filtered reports of the logged-in user (GET /api/reports/my-reports/filter?status=Resolved&category=Infastructure&priority=High)
exports.filterUserReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, category, priority } = req.query;

    let filter = { user: userId }; // Ensure the user only fetches their reports

    if (category) filter.category = category;
    if (status) {
      const validStatuses = ['Pending', 'In Progress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      filter.status = status;
    }
    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value.' });
      }
      filter.priority = priority;
    }

    // Fetch reports based on dynamic filters

    const reports = await Report.find(filter).sort({ createdAt: -1 });

    if (!reports.length) {
      return res
        .status(404)
        .json({ message: 'No reports found matching criteria' });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request to reopen a report (POST /api/reports/reopen-request/:id)
exports.requestReportReopen = async (req, res) => {
  try {
    const userId = req.user.id;
    const reportId = req.params.id;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'A reason is required.' });
    }

    const report = await Report.findOne({ _id: reportId, user: userId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.status !== 'Resolved') {
      return res.status(400).json({
        message: 'Only resolved reports can be reopened.',
      });
    }

    if (report.reopenRequest.status === 'Pending') {
      return res
        .status(400)
        .json({ message: 'You already have a pending reopen request.' });
    }

    report.reopenRequest = {
      status: 'Pending',
      reason,
      requestedAt: new Date(),
    };

    await report.save();

    res.status(200).json({
      message: 'Reopen request submitted. Awaiting admin approval.',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? ADMIN CONTROLLER FUNCTIONS
//
// Get all reports (GET /api/reports/all) (Admin Only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('user', 'name email');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter Reports by Category, Status and Priority (GET /api/reports/filter?category=Security&status=Resolved&priority=High) (Admin Only)
exports.filterReports = async (req, res) => {
  try {
    const { category, status, priority } = req.query; // Get query params

    const filter = {}; // Initialize empty filter object

    if (category) filter.category = category;
    if (status) {
      const validStatuses = ['Pending', 'In Progress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      filter.status = status;
    }
    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value.' });
      }
      filter.priority = priority;
    }

    // Fetch reports based on dynamic filters
    const reports = await Report.find(filter).populate('user', 'name email');

    if (!reports.length) {
      return res
        .status(404)
        .json({ message: 'No reports found matching criteria' });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get nearby reports based on user's location (GET /api/reports/nearby) (Admin Only)
exports.getNearbyReports = async (req, res) => {
  try {
    let { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: 'Latitude and longitude are required.' });
    }

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    radius = parseFloat(radius) || 10; // Default to 10 km if not provided

    const earthRadiusInKm = 6371; // Earth's radius in kilometers
    const maxDistance = radius / earthRadiusInKm; // Convert km to radians

    const reports = await Report.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], maxDistance],
        },
      },
    }).populate('user', 'name email');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update report status (PUT /api/reports/:id/status) (Admin Only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Find and update the report
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return updated document
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Report status updated.', updatedReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve or reject a report reopening request (PUT /api/reports/reopen-approval/:id)
exports.approveReopenRequest = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { action, adminResponse } = req.body; // action = 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        message: 'Invalid action. Use "approve" or "reject".',
      });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.reopenRequest.status !== 'Pending') {
      return res.status(400).json({
        message: 'No pending reopen request for this report.',
      });
    }

    if (action === 'approve') {
      report.status = 'Pending';
      report.reopenRequest.status = 'Approved';
    } else {
      if (!adminResponse) {
        return res.status(400).json({
          message: 'Rejection must include a reason.',
        });
      }
      report.reopenRequest.status = 'Rejected';
      report.reopenRequest.adminResponse = adminResponse;
    }

    report.reopenRequest.reviewedAt = new Date();

    await report.save();

    res.status(200).json({
      message: `Report reopening request ${action}d.`,
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
