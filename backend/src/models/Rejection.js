const mongoose = require('mongoose');

const RejectionSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    reason: { type: String, required: true },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Admin who rejected
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rejection', RejectionSchema);
