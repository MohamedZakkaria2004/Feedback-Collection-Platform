// frontend/src/components/forms/FormsList.js
import React from 'react';

const FormsList = ({ forms, onViewResponses, onDeleteForm }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const getPublicUrl = (formId) => {
    return `${window.location.origin}/form/${formId}`;
  };

  if (forms.length === 0) {
    return (
      <div className="empty-state">
        <p>No forms created yet. Create your first form to get started!</p>
      </div>
    );
  }

  return (
    <div className="forms-list">
      {forms.map((form) => (
        <div key={form._id} className="form-card">
          <div className="form-header">
            <h3>{form.title}</h3>
            <div className="form-actions">
              <button
                onClick={() => onViewResponses(form)}
                className="view-btn"
              >
                View Responses ({form.responseCount || 0})
              </button>
              <button
                onClick={() => onDeleteForm(form._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
          
          {form.description && (
            <p className="form-description">{form.description}</p>
          )}
          
          <div className="form-meta">
            <span className="question-count">
              {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
            </span>
            <span className="created-date">
              Created: {new Date(form.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="form-link">
            <label>Public Link:</label>
            <div className="link-container">
              <input
                type="text"
                value={getPublicUrl(form._id)}
                readOnly
                className="link-input"
              />
              <button
                onClick={() => copyToClipboard(getPublicUrl(form._id))}
                className="copy-btn"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormsList;