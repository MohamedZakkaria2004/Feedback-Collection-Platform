// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formsAPI, responsesAPI } from '../services/api';
import CreateFormModal from '../components/forms/CreateFormModal';
import FormsList from '../components/forms/FormsList';
import ResponsesView from '../components/dashboard/ResponsesView';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forms');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const response = await formsAPI.getForms();
      setForms(response.data);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async (formId) => {
    try {
      const response = await responsesAPI.getFormResponses(formId);
      setResponses(response.data);
      setActiveTab('responses');
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const handleCreateForm = async (formData) => {
    try {
      await formsAPI.createForm(formData);
      setShowCreateModal(false);
      loadForms();
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await formsAPI.deleteForm(formId);
        loadForms();
        if (selectedForm?._id === formId) {
          setSelectedForm(null);
          setActiveTab('forms');
        }
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  const handleViewResponses = async (form) => {
    setSelectedForm(form);
    loadResponses(form._id);
  };

  const handleExportResponses = async (formId) => {
    try {
      const response = await responsesAPI.exportResponses(formId);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `responses-${formId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting responses:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Feedback Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'forms' ? 'active' : ''}
          onClick={() => setActiveTab('forms')}
        >
          My Forms
        </button>
        {selectedForm && (
          <button 
            className={activeTab === 'responses' ? 'active' : ''}
            onClick={() => setActiveTab('responses')}
          >
            Responses - {selectedForm.title}
          </button>
        )}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'forms' && (
          <div className="forms-section">
            <div className="section-header">
              <h2>My Forms</h2>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="create-btn"
              >
                Create New Form
              </button>
            </div>
            <FormsList 
              forms={forms}
              onViewResponses={handleViewResponses}
              onDeleteForm={handleDeleteForm}
            />
          </div>
        )}

        {activeTab === 'responses' && selectedForm && (
          <ResponsesView 
            form={selectedForm}
            responses={responses}
            onExport={() => handleExportResponses(selectedForm._id)}
          />
        )}
      </main>

      {showCreateModal && (
        <CreateFormModal
          onSubmit={handleCreateForm}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;