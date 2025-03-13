const ReportResponse = require('../models/ReportResponse');
const Report = require('../models/Report');

// ? USER CONTROLLER FUNCTIONS.
//
// Function to allow a user to respond to a response by an admin.
exports.respondToResponse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { responseId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'Comment is required.' });
    }

    // Find the response
    const response = await ReportResponse.findById(responseId);
    if (!response) {
      return res.status(404).json({ message: 'Response not found.' });
    }

    // Ensure the user has not already commented
    const hasCommented = response.userFeedback.some(
      (feedback) => feedback.user.toString() === userId
    );

    if (hasCommented) {
      return res.status(400).json({
        message: 'You have already provided feedback for this response.',
      });
    }

    // Add user comment to the response
    response.userFeedback.push({ user: userId, comment });
    await response.save();

    res.status(201).json({ message: 'Feedback added successfully.', response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResponsesForReport = async (req, res) => {
  try {
    const { reportId } = req.params; // Report ID is passed in the URL
    const userId = req.user.id; // User's ID is attached by the auth middleware.
    const userRole = req.user.role; // User's role is attached by the auth middleware.

    // Find the report to check ownership
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Users can only see responses for their own reports
    if (userRole !== 'admin' && report.user.toString() !== userId) {
      return res.status(403).json({
        message: 'Access denied. You can only view responses for your reports.',
      });
    }

    // Fetch all responses for the report
    const responses = await ReportResponse.find({ reportId })
      .populate('responder', 'name email') // Populate admin who responded
      .populate('userFeedback.user', 'name email') // Populate users who commented
      .sort({ timestamp: -1 });

    if (!responses.length) {
      return res
        .status(404)
        .json({ message: 'No responses found for this report.' });
    }

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ? ADMIN & USER CONTROLLER FUNCTIONS.
exports.editResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { message, userFeedback } = req.body; // Allow updates to message and feedback
    const userId = req.user.id;
    const userRole = req.user.role;

    const response = await ReportResponse.findById(responseId);
    if (!response) {
      return res.status(404).json({ message: 'Response not found.' });
    }

    // Admins can edit any response but NOT `userFeedback`
    if (userRole === 'admin') {
      if (userFeedback) {
        return res
          .status(403)
          .json({ message: 'Admins cannot edit user feedback.' });
      }

      response.message = message || response.message;
      response.lastEdited = Date.now();
      await response.save();
      return res
        .status(200)
        .json({ message: 'Response updated successfully.', response });
    }

    // Users can only edit their own response within 1 hour
    if (response.responder.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'You can only edit your own responses.' });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (response.timestamp < oneHourAgo) {
      return res.status(403).json({
        message: 'Response can only be edited within 1 hour of posting.',
      });
    }

    response.message = message || response.message;
    response.lastEdited = Date.now();
    await response.save();

    res
      .status(200)
      .json({ message: 'Response updated successfully.', response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ? ADMIN CONTROLLER FUNCTIONS.
//
// Function to allow an admin to respond to a report.
exports.adminRespondToReport = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { reportId } = req.params;
    const { message, status } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Response message is required.' });
    }

    // Find the report
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Validate status if provided
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Save the admin's response
    const adminResponse = new ReportResponse({
      reportId,
      responder: adminId,
      message,
    });

    await adminResponse.save();

    // Update report status if provided
    if (status) {
      report.status = status;
      await report.save();
    }

    res.status(201).json({
      message: 'Admin response recorded successfully.',
      response: adminResponse,
      updatedStatus: status || report.status, // Return updated status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
