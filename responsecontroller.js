const { validationResult } = require('express-validator');
const Response = require('../models/Response');
const Form = require('../models/Form');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// Submit a response
const submitResponse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { formId, answers, submittedBy, submitterEmail } = req.body;

    // Find the form
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (!form.isActive) {
      return res.status(400).json({ error: 'Form is no longer accepting responses' });
    }

    // Validate answers
    if (!answers || answers.length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    // Process answers
    const processedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      question: answer.question,
      answer: answer.answer,
      questionType: answer.questionType
    }));

    // Create response
    const response = new Response({
      formId,
      formTitle: form.title,
      answers: processedAnswers,
      submittedBy: submittedBy || 'Anonymous',
      submitterEmail,
      ipAddress: req.ip
    });

    await response.save();

    res.status(201).json({
      message: 'Response submitted successfully',
      responseId: response._id
    });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get responses for a form
const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    // Verify form belongs to user
    const form = await Form.findOne({ _id: formId, createdBy: req.user.id });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const responses = await Response.find({ formId })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate summary statistics
    const summary = calculateSummary(responses, form.questions);

    res.json({
      responses,
      summary,
      totalResponses: responses.length
    });
  } catch (error) {
    console.error('Get form responses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Export responses as CSV
const exportResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    // Verify form belongs to user
    const form = await Form.findOne({ _id: formId, createdBy: req.user.id });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const responses = await Response.find({ formId }).sort({ createdAt: -1 });

    if (responses.length === 0) {
      return res.status(400).json({ error: 'No responses to export' });
    }

    // Create CSV headers
    const headers = [
      { id: 'submittedBy', title: 'Submitted By' },
      { id: 'submitterEmail', title: 'Email' },
      { id: 'submittedAt', title: 'Submitted At' }
    ];

    // Add question headers
    form.questions.forEach(question => {
      headers.push({
        id: question.id,
        title: question.question
      });
    });

    // Prepare CSV data
    const csvData = responses.map(response => {
      const row = {
        submittedBy: response.submittedBy,
        submitterEmail: response.submitterEmail || '',
        submittedAt: response.createdAt.toISOString()
      };

      // Add answers
      response.answers.forEach(answer => {
        row[answer.questionId] = answer.answer;
      });

      return row;
    });

    // Create temporary file
    const fileName = `${form.title.replace(/[^a-zA-Z0-9]/g, '_')}_responses_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../temp', fileName);

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const csvWriter = createCsvWriter({
      path: filePath,
      header: headers
    });

    await csvWriter.writeRecords(csvData);

    // Send file
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('File download error:', err);
        res.status(500).json({ error: 'Error downloading file' });
      }

      // Clean up temporary file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Export responses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to calculate summary statistics
const calculateSummary = (responses, questions) => {
  const summary = {};

  questions.forEach(question => {
    const questionResponses = responses
      .map(r => r.answers.find(a => a.questionId === question.id))
      .filter(Boolean);

    if (question.type === 'multiple-choice') {
      const optionCounts = {};
      questionResponses.forEach(response => {
        const answer = response.answer;
        optionCounts[answer] = (optionCounts[answer] || 0) + 1;
      });

      summary[question.id] = {
        type: 'multiple-choice',
        question: question.question,
        totalResponses: questionResponses.length,
        optionCounts,
        mostCommon: Object.keys(optionCounts).reduce((a, b) => 
          optionCounts[a] > optionCounts[b] ? a : b, '')
      };
    } else if (question.type === 'text') {
      summary[question.id] = {
        type: 'text',
        question: question.question,
        totalResponses: questionResponses.length,
        sampleResponses: questionResponses.slice(0, 5).map(r => r.answer)
      };
    }
  });

  return summary;
};

module.exports = {
  submitResponse,
  getFormResponses,
  exportResponses
};