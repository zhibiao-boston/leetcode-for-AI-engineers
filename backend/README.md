# LeetCode for AI Engineers - Backend API

A robust backend API for the LeetCode for AI Engineers platform, built with Node.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **User Management**: Registration, login, profile management
- **Problem Management**: CRUD operations for coding problems
- **Solution Tracking**: User solution storage and management
- **Admin Panel**: Administrative functions for content management
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: PostgreSQL with optimized queries and indexes

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors
- **Validation**: express-validator
- **Logging**: morgan

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database and run the schema:

```bash
# Create database
createdb leetcode_app

# Run schema
psql leetcode_app < database/schema.sql
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/leetcode_app
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leetcode_app
DB_USER=username
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/check-admin` - Check admin status

### Health Check

- `GET /health` - Server health status

## 🗄️ Database Schema

### Users Table
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique email address
- `password_hash` (VARCHAR) - Hashed password
- `name` (VARCHAR) - User's full name
- `role` (VARCHAR) - 'admin' or 'user'
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `last_login_at` (TIMESTAMP) - Last login timestamp

### Problems Table
- `id` (UUID) - Primary key
- `external_id` (VARCHAR) - External API ID
- `title` (VARCHAR) - Problem title
- `description` (TEXT) - Problem description
- `difficulty` (VARCHAR) - 'easy', 'medium', or 'hard'
- `company` (VARCHAR) - Company name
- `categories` (TEXT[]) - Problem categories
- `tags` (TEXT[]) - Problem tags
- `status` (VARCHAR) - 'draft' or 'published'
- `created_by` (UUID) - Creator user ID
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `published_at` (TIMESTAMP) - Publication timestamp

### Solutions Table
- `id` (UUID) - Primary key
- `problem_id` (UUID) - Problem reference
- `user_id` (UUID) - User reference
- `code` (TEXT) - Solution code
- `output` (TEXT) - Execution output
- `error` (TEXT) - Execution error
- `execution_time` (INTEGER) - Execution time in ms
- `status` (VARCHAR) - 'completed', 'in_progress', or 'failed'
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Admin Solutions Table
- `id` (UUID) - Primary key
- `problem_id` (UUID) - Problem reference
- `code` (TEXT) - Official solution code
- `explanation` (TEXT) - Solution explanation
- `time_complexity` (VARCHAR) - Time complexity
- `space_complexity` (VARCHAR) - Space complexity
- `created_by` (UUID) - Creator user ID
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Database models
├── middleware/      # Express middleware
├── routes/          # API routes
├── config/          # Configuration
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and DoS attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **Input Validation**: express-validator for request validation
- **SQL Injection Protection**: Parameterized queries

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all production environment variables are set:

- `NODE_ENV=production`
- `DATABASE_URL` - Production database URL
- `JWT_SECRET` - Strong secret key
- `CORS_ORIGIN` - Frontend domain

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Performance

- **Database Indexes**: Optimized queries with proper indexing
- **Connection Pooling**: PostgreSQL connection pooling
- **Compression**: Response compression with gzip
- **Rate Limiting**: Configurable rate limits per endpoint

## 🔄 API Integration

The backend is designed to integrate with external APIs for:

- Problem data synchronization
- Solution validation
- User analytics
- Content management

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
