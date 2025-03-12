const Report = require('../models/Report');

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

// Get all reports (GET /api/reports/all) (Admin Only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('user', 'name email');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter Reports by Category and Status (GET /api/reports/filter)
exports.filterReports = async (req, res) => {
  try {
    const { category, status } = req.query; // Get query params

    const filter = {}; // Initialize empty filter object

    if (category) filter.category = category;
    if (status) {
      const validStatuses = ['Pending', 'In Progress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      filter.status = status;
    }

    // Fetch reports based on dynamic filters
    const reports = await Report.find(filter).populate('user', 'name email');

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
