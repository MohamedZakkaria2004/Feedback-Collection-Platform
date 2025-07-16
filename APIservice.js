const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Form API methods
  async getForms() {
    return this.request('/forms');
  }

  async getForm(id) {
    return this.request(`/forms/${id}`);
  }

  async createForm(formData) {
    return this.request('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async updateForm(id, formData) {
    return this.request(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(id) {
    return this.request(`/forms/${id}`, {
      method: 'DELETE',
    });
  }

  // Response API methods
  async submitResponse(responseData) {
    return this.request('/responses', {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  async getFormResponses(formId) {
    return this.request(`/responses/form/${formId}`);
  }

  async exportResponses(formId) {
    const token = this.getToken();
    const response = await fetch(`${this.baseURL}/responses/export/${formId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // Public form access
  async getPublicForm(publicUrl) {
    return this.request(`/forms/${publicUrl}`);
  }
}

export default new ApiService();