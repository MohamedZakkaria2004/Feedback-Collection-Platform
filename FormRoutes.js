const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { getForms, getForm, createForm, updateForm, deleteForm } = require('../controllers/formController');

const router = express.Router();

// Middleware to optionally authenticate for public form access
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    return auth(req, res, next);
  }
  next();
};

// Get all forms (protected)
router.get('/', auth, getForms);

// Get specific form (public/protected)
router.get('/:id', optionalAuth, getForm);

// Create form (protected)
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('questions').isArray({ min: 3, max: 5 }).withMessage('Must have between 3 and 5 questions'),
  body('questions.*.type').isIn(['text', 'multiple-choice']).withMessage('Invalid question type'),
  body('questions.*.question').trim().isLength({ min: 5 }).withMessage('Question must be at least 5 characters')
], createForm);

// Update form (protected)
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('questions').optional().isArray({ min: 3, max: 5 }).withMessage('Must have between 3 and 5 questions'),
  body('questions.*.type').optional().isIn(['text', 'multiple-choice']).withMessage('Invalid question type'),
  body('questions.*.question').optional().trim().isLength({ min: 5 }).withMessage('Question must be at least 5 characters')
], updateForm);

// Delete form (protected)
router.delete('/:id', auth, deleteForm);

module.exports = router;