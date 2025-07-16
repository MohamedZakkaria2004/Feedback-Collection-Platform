Feedback Collection Platform
A full-stack web application that enables businesses to create feedback forms and collect responses from customers through public URLs.
Features
Admin/Business Features

Authentication: Secure JWT-based registration and login
Form Creation: Create customizable feedback forms with 3-5 questions
Question Types: Support for text input and multiple-choice questions
Share Links: Generate public URLs for form distribution
Dashboard: View all form responses in tabular format with basic summary statistics
Export: Download responses as CSV files
Form Management: Edit and delete existing forms

Customer/User Features

Public Access: Access forms via public URLs without login
Form Submission: Submit feedback through an intuitive interface
Mobile Responsive: Optimized for mobile devices

Tech Stack
Frontend

React.js - User interface library
React Router - Client-side routing
Tailwind CSS - Styling framework
Lucide React - Icon library
Recharts - Data visualization for dashboard

Backend

Node.js - Runtime environment
Express.js - Web framework
MongoDB - Database
Mongoose - ODM for MongoDB
JWT - Authentication
bcryptjs - Password hashing
CORS - Cross-origin resource sharing

Architecture & Design Decisions
Database Design

Users Collection: Stores admin credentials and profile information
Forms Collection: Stores form metadata, questions, and configuration
Responses Collection: Stores user submissions linked to forms

API Design

RESTful API structure with clear endpoints
JWT middleware for protected routes
Input validation and error handling
Consistent response formats

Frontend Architecture

Component-based architecture with reusable components
Context API for state management
Protected routes for admin features
Responsive design with mobile-first approach

Security Considerations

Password hashing with bcrypt
JWT token expiration
Input sanitization
CORS configuration
Environment variable management

Installation & Setup
Prerequisites

Node.js (v14 or higher)
MongoDB (local or cloud instance)
npm or yarn package manager

Backend Setup

Navigate to the backend directory:

bashcd backend

Install dependencies:

bashnpm install

Create a .env file in the backend directory:

envPORT=5000
MONGODB_URI=mongodb://localhost:27017/feedback-platform
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development

Start the backend server:

bashnpm start
The backend server will run on http://localhost:5000
Frontend Setup

Navigate to the frontend directory:

bashcd frontend

Install dependencies:

bashnpm install

Create a .env file in the frontend directory:

envREACT_APP_API_URL=http://localhost:5000/api

Start the frontend development server:

bashnpm start
The frontend will run on http://localhost:3000
Usage
For Admins/Businesses

Registration: Create a new account at /register
Login: Sign in at /login
Create Form: Navigate to dashboard and click "Create New Form"
Add Questions: Add 3-5 questions with different types (text/multiple-choice)
Share Form: Copy the generated public URL to share with customers
View Responses: Access the dashboard to view all form submissions
Export Data: Download responses as CSV files

For Customers/Users

Access Form: Visit the public URL shared by the business
Fill Form: Complete all required fields
Submit: Submit the form (no registration required)

API Endpoints
Authentication

POST /api/auth/register - Register new admin
POST /api/auth/login - Admin login

Forms

GET /api/forms - Get all forms (admin only)
POST /api/forms - Create new form (admin only)
GET /api/forms/:id - Get specific form
PUT /api/forms/:id - Update form (admin only)
DELETE /api/forms/:id - Delete form (admin only)

Responses

GET /api/responses/form/:formId - Get responses for a form (admin only)
POST /api/responses - Submit form response (public)
GET /api/responses/export/:formId - Export responses as CSV (admin only)

Project Structure
feedback-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── formController.js
│   │   └── responseController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Form.js
│   │   └── Response.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── forms.js
│   │   └── responses.js
│   ├── utils/
│   │   └── csvExport.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── forms/
│   │   │   └── dashboard/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── PublicForm.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
Edge Cases Handled

Form Validation: Client and server-side validation for all inputs
Authentication: JWT expiration and refresh handling
Error Handling: Comprehensive error messages and fallback UI
Loading States: Loading indicators for all async operations
Empty States: Proper handling of empty forms and responses
Mobile Responsiveness: Optimized for various screen sizes
Network Errors: Graceful handling of network failures
Duplicate Submissions: Prevention of duplicate form submissions

Future Enhancements

Advanced Analytics: More detailed response analytics and charts
Form Templates: Pre-built form templates for common use cases
Email Notifications: Notify admins of new responses
Conditional Logic: Dynamic form fields based on previous answers
File Uploads: Support for file upload questions
Multi-language Support: Internationalization features
Rate Limiting: API rate limiting for better security
Audit Logs: Track form modifications and access

Contributing

Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request

License
This project is licensed under the MIT License.
