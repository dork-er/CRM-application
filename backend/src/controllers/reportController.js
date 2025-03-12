const Report = require('../models/Report');

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
