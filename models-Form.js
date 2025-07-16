const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'multiple-choice'],
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    trim: true
  }],
  required: {
    type: Boolean,
    default: true
  }
});

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: {
    type: [QuestionSchema],
    validate: {
      validator: function(questions) {
        return questions.length >= 3 && questions.length <= 5;
      },
      message: 'Form must have between 3 and 5 questions'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publicUrl: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Generate public URL before saving
FormSchema.pre('save', function(next) {
  if (!this.publicUrl) {
    this.publicUrl = mongoose.Types.ObjectId().toString();
  }
  next();
});

module.exports = mongoose.model('Form', FormSchema);