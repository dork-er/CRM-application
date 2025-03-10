const Application = require('../models/Application');
const User = require('../models/User');

// Submit new application with file uploads
exports.submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      idNumber,
      contactAddress,
      pinNumber,
      phoneNumber,
      email,
      block,
      roadStreet,
      plotNumber,
      ownerName,
      sizeRequired,
      dateRequired,
      consumerCategory,
      sanitationMethod,
    } = req.body;

    const idAttachment = req.files['idAttachment']
      ? req.files['idAttachment'][0].path
      : null;
    const pinAttachment = req.files['pinAttachment']
      ? req.files['pinAttachment'][0].path
      : null;

    if (!idAttachment || !pinAttachment) {
      return res
        .status(400)
        .json({ message: 'ID and PIN attachments are required.' });
    }

    const newApplication = new Application({
      fullName,
      idNumber,
      idAttachment,
      contactAddress,
      pinNumber,
      pinAttachment,
      phoneNumber,
      email,
      block,
      roadStreet,
      plotNumber,
      ownerName,
      sizeRequired,
      dateRequired,
      consumerCategory,
      sanitationMethod,
      status: 'Pending',
    });

    await newApplication.save();
    res.status(201).json({
      message: 'Application submitted successfully',
      application: newApplication,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get application status by ID
exports.getApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ status: application.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve application (Admin Only)
exports.approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if already approved
    if (application.status === 'Approved') {
      return res.status(400).json({ message: 'Application already approved' });
    }

    application.status = 'Approved';
    await application.save();

    // Create a new user entry based on approved application
    const newUser = new User({
      fullName: application.fullName,
      idNumber: application.idNumber,
      email: application.email,
      phoneNumber: application.phoneNumber,
      contactAddress: application.contactAddress,
      pinNumber: application.pinNumber,
      pinAttachment: application.pinAttachment,
      idAttachment: application.idAttachment,
      consumerCategory: application.consumerCategory,
      sanitationMethod: application.sanitationMethod,
      password: 'temp1234', // ✅ Temporary Password.
    });

    await newUser.save();

    res.status(200).json({ message: 'Application approved', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
