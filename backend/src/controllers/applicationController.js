// Importing Models
const Application = require('../models/Application');
const User = require('../models/User');
const Rejection = require('../models/Rejection');

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
    console.log(`Application req: ${req}`);
    console.log(`Application req params: ${req.params.id}`);

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

    res
      .status(200)
      .json({ message: 'Application approved, user created', user: newUser });
  } catch (error) {
    console.error('Error approving application:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Reject application (Admin Only)
exports.rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, rejectedBy } = req.body; // Get reason from request body

    // Logging
    // console.log(
    //   `Logging:\nApplication id: ${id}\nReason: ${reason}\nRejected by: ${rejectedBy}`
    // );

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Logging application object
    // console.log(application);

    // Check if already rejected
    if (application.status === 'Rejected') {
      return res.status(400).json({ message: 'Application already rejected' });
    }

    application.status = 'Rejected';
    await application.save();

    // Save rejection reason
    const rejection = new Rejection({
      applicationId: id,
      reason,
      rejectedBy,
    });
    await rejection.save();

    res.status(200).json({
      message: 'Application rejected successfully',
      rejection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find(); // Fetch all applications
    console.log(applications);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an application by ID
exports.deleteApplication = async (req, res) => {
  try {
    // Get application ID from request params
    const { id } = req.params;
    const application = await Application.findById(id);

    // Logging application object
    // console.log(application);

    // Check if application exists
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Delete application
    await Application.findByIdAndDelete(id);

    // Logging success message
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing application by ID
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Contains the fields to update

    //Logging
    console.log(`Application ID: ${id}\nUpdates: ${updates}`);

    // Find and update the application
    const application = await Application.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure it follows the schema rules
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res
      .status(200)
      .json({ message: 'Application updated successfully', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
