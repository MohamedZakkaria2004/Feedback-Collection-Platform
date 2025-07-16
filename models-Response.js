const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  questionType: {
    type: String,
    enum: ['text', 'multiple-choice'],
    required: true
  }
});

const ResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  formTitle: {
    type: String,
    required: true
  },
  answers: {
    type: [AnswerSchema],
    required: true
  },
  submittedBy: {
    type: String,
    default: 'Anonymous'
  },
  submitterEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
ResponseSchema.index({ formId: 1, createdAt: -1 });

module.exports = mongoose.model('Response', ResponseSchema);