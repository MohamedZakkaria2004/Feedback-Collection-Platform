# 📝 Feedback Collection Platform 📊 

A full-stack feedback collection platform built with React, Node.js, Express, and MongoDB. This application allows users to create custom feedback forms, collect responses, and export data.

## Project Structure & Development Approach
This full-stack feedback platform is architected with clear separation of concerns across the backend and frontend. The backend/ folder encapsulates all server-side logic using Express.js and MongoDB, neatly organized into folders for configuration, routing, middleware, models, controllers, and utility functions like CSV export. The frontend/ is built using React with modular components grouped into logical directories such as auth, forms, and dashboard, alongside shared contexts, services, and pages. This structure promotes scalability, readability, and ease of maintenance while adhering to modern development best practices.

The development approach emphasizes a step-by-step, hands-on progression, making it accessible for both beginners and experienced developers. Each layer of functionality—from authentication to form creation and response handling—is implemented incrementally, reinforcing core concepts through practical implementation. The setup encourages component reusability, centralized state management via React Context, and secure API interactions using JWT. Combined with RESTful API design, environment-based configuration, and deployment-readiness, the project serves as both a production-grade application and a comprehensive learning experience.




## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

### Core Features
- **User Authentication**: Secure registration and login system
- **Form Builder**: Dynamic form creation with various field types
- **Response Collection**: Public forms for collecting feedback
- **Data Export**: Export responses to CSV format
- **Dashboard**: Comprehensive overview of forms and responses
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- JWT-based authentication
- RESTful API design
- MongoDB database with Mongoose ODM
- React Router for navigation
- Axios for HTTP requests
- Modern CSS with responsive design

## Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router DOM** 6.8.0 - Client-side routing
- **Axios** 1.6.0 - HTTP client
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
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
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.js
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
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   └── package.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- **MongoDB** (v4.0.0 or higher)
- **Git** (for version control)

### Development Tools (Recommended)
- **Visual Studio Code** or any code editor
- **MongoDB Compass** (GUI for MongoDB)
- **Postman** (for API testing)

### Check Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# Check Git version
git --version
```

## Installation Guide

### Step 1: Clone or Create Project Directory
```bash
# Option A: If you have a repository
git clone <your-repository-url>
cd feedback-platform

# Option B: Create new project
mkdir feedback-platform
cd feedback-platform
```

### Step 2: Backend Setup

#### 2.1 Create Backend Directory Structure
```bash
mkdir backend
cd backend
mkdir config controllers middleware models routes utils
```

#### 2.2 Initialize Backend Project
```bash
npm init -y
```

#### 2.3 Install Backend Dependencies
```bash
# Core dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv

# Development dependencies
npm install --save-dev nodemon concurrently
```

#### 2.4 Create Backend Files
Create all the backend files according to the project structure. Key files include:

**package.json scripts section:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Step 3: Frontend Setup

#### 3.1 Create React App
```bash
# Navigate back to project root
cd ..

# Create React app
npx create-react-app frontend
cd frontend
```

#### 3.2 Install Frontend Dependencies
```bash
npm install axios react-router-dom
```

#### 3.3 Clean Up Default Files
```bash
# Remove unnecessary files
rm src/App.test.js src/logo.svg src/reportWebVitals.js src/setupTests.js
```

#### 3.4 Create Frontend Files
Create all the frontend files according to the project structure.

## Environment Setup

### Backend Environment Variables
Create `backend/.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/feedback-platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
Create `frontend/.env` file:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Feedback Platform

# Build Configuration
GENERATE_SOURCEMAP=false
```

## Database Setup

### Step 1: Install MongoDB

#### For Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service

#### For macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### For Linux (Ubuntu):
```bash
# Import public key
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Verify MongoDB Installation
```bash
# Check if MongoDB is running
mongosh

# In MongoDB shell
show dbs
exit
```

### Step 3: Create Database (Optional)
MongoDB will automatically create the database when you first connect, but you can create it manually:
```bash
mongosh
use feedback-platform
db.createCollection("users")
exit
```

## Running the Application

### Development Mode

#### Method 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Method 2: Run Concurrently (Recommended)

**Add to backend/package.json:**
```json
{
  "scripts": {
    "client": "cd ../frontend && npm start",
    "server": "nodemon server.js",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}
```

**Run both:**
```bash
cd backend
npm run dev
```

### Production Mode

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm run build
# Serve the build folder with a static server
npx serve -s build
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Form Endpoints
- `POST /api/forms` - Create new form (protected)
- `GET /api/forms` - Get user's forms (protected)
- `GET /api/forms/:id` - Get specific form (protected)
- `PUT /api/forms/:id` - Update form (protected)
- `DELETE /api/forms/:id` - Delete form (protected)
- `GET /api/forms/public/:id` - Get public form
- `PATCH /api/forms/:id/toggle` - Toggle form status (protected)

### Response Endpoints
- `POST /api/responses/:formId` - Submit response
- `GET /api/responses/:formId` - Get form responses (protected)
- `DELETE /api/responses/:responseId` - Delete response (protected)
- `GET /api/responses/:formId/export` - Export responses as CSV (protected)

## Testing

### Backend Testing
```bash
cd backend

# Test server connection
curl http://localhost:5000/api/auth/test

# Test with Postman
# Import API collection and test all endpoints
```

### Frontend Testing
```bash
cd frontend

# Run built-in tests
npm test

# Test in browser
# Open http://localhost:3000
# Test all user flows
```

### Integration Testing
1. Register a new user
2. Login with credentials
3. Create a new form
4. Submit responses via public form
5. View responses in dashboard
6. Export responses as CSV

## Deployment

### Backend Deployment (Heroku)

#### Step 1: Prepare for Deployment
```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Update package.json
# Add "start": "node server.js" to scripts
```

#### Step 2: Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-jwt-secret
heroku config:set MONGODB_URI=your-production-mongodb-uri

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Frontend Deployment (Netlify)

#### Step 1: Build the Application
```bash
cd frontend

# Update .env for production
REACT_APP_API_URL=https://your-app-name-backend.herokuapp.com/api

# Build the application
npm run build
```

#### Step 2: Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

### Database Deployment (MongoDB Atlas)

#### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Create database user
5. Configure IP whitelist

#### Step 2: Update Connection String
```bash
# Update MONGODB_URI in your environment
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback-platform?retryWrites=true&w=majority
```

### Alternative Deployment Options

#### VPS Deployment (DigitalOcean, AWS, etc.)
```bash
# Install Node.js and MongoDB on server
# Clone repository
# Install dependencies
# Configure environment variables
# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name feedback-backend
pm2 startup
pm2 save
```

#### Docker Deployment
Create `Dockerfile` for backend:
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/feedback-platform
  
  mongodb:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Troubleshooting

### Common Issues

#### Backend Issues

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill process
kill -9 <process_id>

# Or use different port
PORT=5001 npm run dev
```

**MongoDB Connection Error:**
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
net start MongoDB                  # Windows

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod           # Linux
net stop MongoDB && net start MongoDB   # Windows
```

**JWT Token Issues:**
- Ensure JWT_SECRET is set in .env
- Check token expiration
- Verify token format in requests

#### Frontend Issues

**CORS Errors:**
- Ensure backend CORS is configured correctly
- Check API URL in frontend .env
- Verify requests include proper headers

**API Connection Issues:**
- Check if backend is running
- Verify API endpoints
- Check network requests in browser dev tools

**Build Errors:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

#### Backend Debug:
```bash
# Run with debug logs
DEBUG=* npm run dev

# Or use specific debug namespace
DEBUG=app:* npm run dev
```

#### Frontend Debug:
```bash
# Run with verbose logging
REACT_APP_LOG_LEVEL=debug npm start
```

## Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test
4. Commit: `git commit -m 'Add new feature'`
5. Push: `git push origin feature/new-feature`
6. Create Pull Request

### Code Style
- Use ESLint for JavaScript linting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test all changes before committing

### Project Structure Guidelines
- Keep components small and focused
- Use consistent naming conventions
- Organize files by feature
- Separate concerns (UI, logic, data)
- Follow REST API conventions

## License

This project is licensed under the **MIT License** - see the LICENSE file for details.

