const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { submitResponse, getFormResponses, exportResponses } = require('../controllers/responseController');

const router = express.Router();

// Submit response (public)
router.post('/', [
  body('formId').isMongoId().withMessage('Invalid form ID'),
  body('answers').isArray({ min: 1 }).withMessage('At least one answer is required'),
  body('answers.*.questionId').notEmpty().withMessage('Question ID is required'),
  body('answers.*.answer').notEmpty().withMessage('Answer is required'),
  body('submitterEmail').optional().isEmail().withMessage('Invalid email format')
], submitResponse);

// Get responses for a form (protected)
router.get('/form/:formId', auth, getFormResponses);

// Export responses as CSV (protected)
router.get('/export/:formId', auth, exportResponses);

module.exports = router;