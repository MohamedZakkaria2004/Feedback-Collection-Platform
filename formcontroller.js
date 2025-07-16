const { validationResult } = require('express-validator');
const Form = require('../models/Form');
const Response = require('../models/Response');
const mongoose = require('mongoose');

// Get all forms for a user
const getForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name businessName');

    // Get response count for each form
    const formsWithStats = await Promise.all(
      forms.map(async (form) => {
        const responseCount = await Response.countDocuments({ formId: form._id });
        return {
          ...form.toObject(),
          responseCount
        };
      })
    );

    res.json({ forms: formsWithStats });
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific form
const getForm = async (req, res) => {
  try {
    const { id } = req.params;
    let form;

    // Check if it's a public URL or form ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      form = await Form.findById(id).populate('createdBy', 'name businessName');
    } else {
      form = await Form.findOne({ publicUrl: id }).populate('createdBy', 'name businessName');
    }

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // If user is authenticated and owns the form, return full details
    if (req.user && form.createdBy._id.toString() === req.user.id) {
      const responseCount = await Response.countDocuments({ formId: form._id });
      return res.json({
        form: {
          ...form.toObject(),
          responseCount
        }
      });
    }

    // For public access, return limited info
    res.json({
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        questions: form.questions,
        isActive: form.isActive,
        createdBy: {
          businessName: form.createdBy.businessName
        }
      }
    });
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new form
const createForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, questions } = req.body;

    // Validate questions
    if (!questions || questions.length < 3 || questions.length > 5) {
      return res.status(400).json({ error: 'Form must have between 3 and 5 questions' });
    }

    // Generate unique public URL
    const publicUrl = new mongoose.Types.ObjectId().toString();

    const form = new Form({
      title,
      description,
      questions: questions.map((q, index) => ({
        id: `q${index + 1}`,
        type: q.type,
        question: q.question,
        options: q.options || [],
        required: q.required !== false
      })),
      createdBy: req.user.id,
      publicUrl
    });

    await form.save();
    await form.populate('createdBy', 'name businessName');

    res.status(201).json({
      message: 'Form created successfully',
      form: {
        ...form.toObject(),
        responseCount: 0
      }
    });
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a form
const updateForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, questions, isActive } = req.body;

    const form = await Form.findOne({ _id: id, createdBy: req.user.id });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Update form fields
    if (title) form.title = title;
    if (description !== undefined) form.description = description;
    if (isActive !== undefined) form.isActive = isActive;
    
    if (questions) {
      if (questions.length < 3 || questions.length > 5) {
        return res.status(400).json({ error: 'Form must have between 3 and 5 questions' });
      }
      
      form.questions = questions.map((q, index) => ({
        id: `q${index + 1}`,
        type: q.type,
        question: q.question,
        options: q.options || [],
        required: q.required !== false
      }));
    }

    await form.save();
    await form.populate('createdBy', 'name businessName');

    const responseCount = await Response.countDocuments({ formId: form._id });

    res.json({
      message: 'Form updated successfully',
      form: {
        ...form.toObject(),
        responseCount
      }
    });
  } catch (error) {
    console.error('Update form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a form
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findOne({ _id: id, createdBy: req.user.id });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Delete all responses for this form
    await Response.deleteMany({ formId: id });
    
    // Delete the form
    await Form.findByIdAndDelete(id);

    res.json({ message: 'Form and all responses deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getForms,
  getForm,
  createForm,
  updateForm,
  deleteForm
};