// frontend/src/components/dashboard/ResponsesView.js
import React, { useState } from 'react';

const ResponsesView = ({ form, responses, onExport }) => {
  const [viewMode, setViewMode] = useState('table');

  const getSummaryData = () => {
    const summary = {};
    
    form.questions.forEach((question, questionIndex) => {
      const questionAnswers = responses.map(response => 
        response.answers.find(answer => answer.questionIndex === questionIndex)?.value || ''
      ).filter(answer => answer !== '');
      
      if (question.type === 'multiple-choice') {
        summary[questionIndex] = {};
        questionAnswers.forEach(answer => {
          summary[questionIndex][answer] = (summary[questionIndex][answer] || 0) + 1;
        });
      } else if (question.type === 'checkbox') {
        summary[questionIndex] = {};
        questionAnswers.forEach(answer => {
          if (Array.isArray(answer)) {
            answer.forEach(option => {
              summary[questionIndex][option] = (summary[questionIndex][option] || 0) + 1;
            });
          }
        });
      } else {
        summary[questionIndex] = {
          totalResponses: questionAnswers.length,
          responses: questionAnswers
        };
      }
    });
    
    return summary;
  };

  const renderTableView = () => (
    <div className="table-container">
      <table className="responses-table">
        <thead>
          <tr>
            <th>Submitted At</th>
            {form.questions.map((question, index) => (
              <th key={index}>{question.text}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.map((response, responseIndex) => (
            <tr key={responseIndex}>
              <td>{new Date(response.submittedAt).toLocaleString()}</td>
              {form.questions.map((question, questionIndex) => {
                const answer = response.answers.find(
                  a => a.questionIndex === questionIndex
                );
                return (
                  <td key={questionIndex}>
                    {answer ? (
                      Array.isArray(answer.value) 
                        ? answer.value.join(', ') 
                        : answer.value
                    ) : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSummaryView = () => {
    const summary = getSummaryData();
    
    return (
      <div className="summary-container">
        {form.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="question-summary">
            <h3>{question.text}</h3>
            
            {question.type === 'multiple-choice' && (
              <div className="chart-container">
                {Object.entries(summary[questionIndex] || {}).map(([option, count]) => (
                  <div key={option} className="bar-item">
                    <span className="option-label">{option}</span>
                    <div className="bar-container">
                      <div 
                        className="bar" 
                        style={{ 
                          width: `${(count / responses.length) * 100}%` 
                        }}
                      />
                      <span className="count">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'checkbox' && (
              <div className="chart-container">
                {Object.entries(summary[questionIndex] || {}).map(([option, count]) => (
                  <div key={option} className="bar-item">
                    <span className="option-label">{option}</span>
                    <div className="bar-container">
                      <div 
                        className="bar" 
                        style={{ 
                          width: `${(count / responses.length) * 100}%` 
                        }}
                      />
                      <span className="count">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {(question.type === 'text' || question.type === 'textarea') && (
              <div className="text-responses">
                <p>Total Responses: {summary[questionIndex]?.totalResponses || 0}</p>
                <div className="responses-list">
                  {summary[questionIndex]?.responses?.slice(0, 5).map((response, index) => (
                    <div key={index} className="response-item">
                      "{response}"
                    </div>
                  ))}
                  {summary[questionIndex]?.responses?.length > 5 && (
                    <div className="more-responses">
                      ... and {summary[questionIndex].responses.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (responses.length === 0) {
    return (
      <div className="empty-responses">
        <h2>No responses yet</h2>
        <p>Share your form link to start collecting responses!</p>
        <div className="form-link">
          <strong>Form Link:</strong>
          <input
            type="text"
            value={`${window.location.origin}/form/${form._id}`}
            readOnly
            className="link-input"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="responses-view">
      <div className="responses-header">
        <h2>Responses for: {form.title}</h2>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button
              className={viewMode === 'summary' ? 'active' : ''}
              onClick={() => setViewMode('summary')}
            >
              Summary View
            </button>
          </div>
          <button onClick={onExport} className="export-btn">
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="responses-stats">
        <span className="stat">
          Total Responses: {responses.length}
        </span>
        <span className="stat">
          Latest Response: {new Date(responses[0]?.submittedAt).toLocaleString()}
        </span>
      </div>
      
      {viewMode === 'table' ? renderTableView() : renderSummaryView()}
    </div>
  );
};

export default ResponsesView;
