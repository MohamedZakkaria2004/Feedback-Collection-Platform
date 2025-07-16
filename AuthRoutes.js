const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { register, login, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('businessName').trim().isLength({ min: 2 }).withMessage('Business name must be at least 2 characters')
], register);

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Get current user
router.get('/me', auth, getCurrentUser);

module.exports = router;