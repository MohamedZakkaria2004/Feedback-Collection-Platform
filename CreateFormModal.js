// frontend/src/components/forms/CreateFormModal.js
import React, { useState } from 'react';

const CreateFormModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [
      { text: '', type: 'text', required: true, options: [] }
    ]
  });

  const questionTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const addQuestion = () => {
    if (formData.questions.length < 5) {
      setFormData({
        ...formData,
        questions: [...formData.questions, { text: '', type: 'text', required: true, options: [] }]
      });
    }
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        questions: updatedQuestions
      });
    }
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push('');
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Form</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Form Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div className="questions-section">
            <h3>Questions</h3>
            {formData.questions.map((question, index) => (
              <div key={index} className="question-builder">
                <div className="question-header">
                  <span>Question {index + 1}</span>
                  {formData.questions.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Question Text</label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Question Type</label>
                  <select
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                  >
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => handleQuestionChange(index, 'required', e.target.checked)}
                    />
                    Required
                  </label>
                </div>
                
                {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
                  <div className="options-section">
                    <label>Options</label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-input">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index, optionIndex)}
                          className="remove-option-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="add-option-btn"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {formData.questions.length < 5 && (
              <button type="button" onClick={addQuestion} className="add-question-btn">
                Add Question
              </button>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFormModal;