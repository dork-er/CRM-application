const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'Report Updated', 'Report Assigned'
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  details: { type: Object, default: {} },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
