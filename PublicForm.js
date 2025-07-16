// frontend/src/pages/PublicForm.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formsAPI, responsesAPI } from '../services/api';

const PublicForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      const response = await formsAPI.getPublicForm(id);
      setForm(response.data);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach((question, index) => {
        initialAnswers[index] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      setError('Form not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Convert answers object to array format
      const answersArray = form.questions.map((question, index) => ({
        questionIndex: index,
        value: answers[index] || '',
      }));

      await responsesAPI.submitResponse(id, { answers: answersArray });
      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  if (error && !form) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="success-container">
        <h2>Thank you!</h2>
        <p>Your response has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="public-form-container">
      <div className="form-card">
        <h1>{form.title}</h1>
        {form.description && <p className="form-description">{form.description}</p>}
        
        <form onSubmit={handleSubmit}>
          {form.questions.map((question, index) => (
            <div key={index} className="question-group">
              <label className="question-label">
                {question.text}
                {question.required && <span className="required">*</span>}
              </label>
              
              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required={question.required}
                  className="text-input"
                />
              )}
              
              {question.type === 'textarea' && (
                <textarea
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required={question.required}
                  className="textarea-input"
                  rows={4}
                />
              )}
              
              {question.type === 'multiple-choice' && (
                <div className="radio-group">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="radio-label">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        required={question.required}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'checkbox' && (
                <div className="checkbox-group">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={option}
                        checked={(answers[index] || []).includes(option)}
                        onChange={(e) => {
                          const currentAnswers = answers[index] || [];
                          if (e.target.checked) {
                            handleAnswerChange(index, [...currentAnswers, option]);
                          } else {
                            handleAnswerChange(index, currentAnswers.filter(a => a !== option));
                          }
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;