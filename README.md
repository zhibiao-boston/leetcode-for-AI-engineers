# LeetCode for AI Engineers

A full-stack web application for AI engineers to practice coding challenges with authentication, Python code execution, and problem management. Built with React, TypeScript, Node.js, and PostgreSQL.

## 🎯 Features

### Frontend (React/TypeScript)
- **Beautiful Dark Theme**: Sophisticated dark interface with purple accents
- **Two-Panel Layout**: 40% question list, 60% question details
- **Desktop Optimized**: Designed for 1200px+ width screens
- **Python Code Editor**: Monaco Editor with syntax highlighting and execution
- **User Authentication**: Sign up, sign in, and user profile management
- **Question Categories**: Coding, phone, onsite interview questions
- **Rich Content**: Detailed descriptions with tags and metadata
- **Smooth Interactions**: Hover effects and transitions

### Backend (Node.js/TypeScript)
- **JWT Authentication**: Secure user authentication with bcrypt password hashing
- **RESTful API**: Complete API endpoints for users and problems
- **PostgreSQL Database**: Robust data storage with proper schema design
- **Security Middleware**: CORS, rate limiting, and input validation
- **Mock Database**: Demo server for testing without live database

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- PostgreSQL (optional - mock database available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zhibiao-boston/leetcode-for-AI-engineers.git
cd leetcode-for-AI-engineers
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server (Terminal 1):
```bash
cd backend
npm run dev
```
Backend runs on [http://localhost:5000](http://localhost:5000)

2. Start the frontend development server (Terminal 2):
```bash
cd frontend
npm start
```
Frontend runs on [http://localhost:3000](http://localhost:3000)

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS 3.4** for styling
- **Monaco Editor** for Python code editing
- **Create React App** for build tooling
- **Heroicons** for SVG icons
- **Inter** font family

### Backend
- **Node.js** + TypeScript
- **Express.js** web framework
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** and security middleware

## 📋 Sample Questions

The application includes 8 sample AI/ML coding questions:

1. **Design Database** (Medium) - Database system design
2. **Array Compression** (Medium) - Compression algorithms
3. **Backend Assignment Interview** (Hard) - Backend system design
4. **Basic Calculator** (Easy) - Mathematical expression evaluation
5. **LLM Token Counter** (Medium) - Token counting for LLMs
6. **Neural Network Optimizer** (Hard) - Neural network optimization
7. **Prompt Engineering Framework** (Medium) - Prompt management system
8. **Vector Database Query** (Hard) - Vector similarity search

## 🎨 Design

- **Color Palette**: Dark gray (#1a1a1a) background with purple (#8b5cf6) accents
- **Typography**: Inter font family for clean readability
- **Layout**: Fixed two-panel design optimized for desktop
- **Interactions**: Smooth hover effects and selection states

## 📁 Project Structure

```
leetcode-for-AI-engineers/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.tsx    # Authentication modal
│   │   │   ├── Header.tsx       # Top navigation header
│   │   │   ├── PythonEditor.tsx # Monaco code editor
│   │   │   ├── QuestionList.tsx # Left panel question list
│   │   │   ├── QuestionDetails.tsx # Right panel question details
│   │   │   └── UserProfile.tsx  # User profile component
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── data/
│   │   │   └── questions.ts     # Sample question data
│   │   └── App.tsx              # Main application component
│   └── package.json
├── backend/                      # Node.js backend API
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.ts # Authentication controller
│   │   ├── models/
│   │   │   ├── User.ts          # User database model
│   │   │   ├── Problem.ts       # Problem database model
│   │   │   └── Solution.ts       # Solution database model
│   │   ├── services/
│   │   │   └── auth.service.ts  # Authentication service
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts # JWT middleware
│   │   ├── routes/
│   │   │   └── auth.routes.ts    # Authentication routes
│   │   └── config/
│   │       ├── database.ts      # Database configuration
│   │       └── index.ts         # App configuration
│   ├── database/
│   │   └── schema.sql           # PostgreSQL schema
│   └── package.json
└── prompt/                      # Development prompts
    └── *.md                     # Feature development prompts
```

## 🚀 Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
```
This builds the frontend for production to the `frontend/build` folder.

### Backend Production Build
```bash
cd backend
npm run build
```
This compiles TypeScript to JavaScript in the `backend/dist` folder.

### Production Start
```bash
cd backend
npm start
```
This starts the production backend server.

## ✨ Key Features

### Python Code Editor
- **Monaco Editor**: Professional code editor with Python syntax highlighting
- **Code Execution**: Simulated Python execution with realistic output
- **Error Handling**: Syntax error detection and user-friendly error messages
- **Execution Time**: Performance tracking for code execution

### User Authentication
- **Sign Up/Sign In**: Complete user registration and login system
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **User Profiles**: User information display and management
- **Password Security**: bcrypt password hashing for security

### Question Management
- **Rich Content**: Detailed problem descriptions with examples
- **Difficulty Levels**: Easy, Medium, Hard categorization
- **Categories**: Coding, phone, onsite interview questions
- **Interactive UI**: Smooth animations and hover effects

## 📝 Development

### Frontend Development
- **Start Development**: `cd frontend && npm start`
- **Run Tests**: `cd frontend && npm test`
- **Build Production**: `cd frontend && npm run build`

### Backend Development
- **Start Development**: `cd backend && npm run dev`
- **Build TypeScript**: `cd backend && npm run build`
- **Run Tests**: `cd backend && npm test`
- **Lint Code**: `cd backend && npm run lint`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

- [x] User authentication and progress tracking
- [x] Code editor integration (Monaco Editor)
- [ ] Real Python execution (Pyodide integration)
- [ ] Admin panel for problem management
- [ ] User progress tracking and statistics
- [ ] Search and filtering functionality
- [ ] More question categories and difficulty levels
- [ ] Code submission and evaluation system
- [ ] Performance optimizations
- [ ] Mobile responsiveness

---

Built with ❤️ for AI engineers practicing LLM coding challenges.