const mongoose = require('mongoose');

const ReportResponseSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
  },
  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, // Who responded?
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  lastEdited: { type: Date }, // Track last edit time
  userFeedback: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      comment: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('ReportResponse', ReportResponseSchema);
