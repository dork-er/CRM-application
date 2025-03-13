const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  category: { type: String, required: true }, // e.g., 'Security', 'Infrastructure'
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  attachments: [{ type: String }], // Stores file paths or URLs
  createdAt: { type: Date, default: Date.now },

  // Reopen request fields
  reopenRequest: {
    status: {
      type: String,
      enum: ['None', 'Pending', 'Approved', 'Rejected'],
      default: 'None',
    },
    reason: { type: String }, // User's reason for reopening
    adminResponse: { type: String }, // Admin's rejection reason
    requestedAt: { type: Date }, // Timestamp for request
    reviewedAt: { type: Date }, // Timestamp for admin response
  },
});

ReportSchema.index({ location: '2dsphere' }); // Enables geolocation queries

module.exports = mongoose.model('Report', ReportSchema);
