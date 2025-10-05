# Beyond Border Backend

A professional Express.js backend application for website maintenance management with MySQL database integration.

## Features

- **Authentication System**: Complete JWT-based authentication with register, login, and profile management
- **Database Integration**: MySQL database with connection pooling and automatic table creation
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Professional Structure**: Separation of concerns with models, controllers, routes, and middleware
- **Environment Configuration**: Flexible configuration for development and production
- **API Documentation**: Professional Swagger/OpenAPI documentation with interactive testing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Health Check
- `GET /health` - Server health check

### Documentation
- `GET /` - Redirects to API documentation
- `GET /api-docs` - Interactive Swagger API documentation

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beyond-border-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `beyond_border_db`
   - Update the `.env` file with your database credentials:
     ```env
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=beyond_border_db
     DB_PORT=3306
     ```

4. **Environment Configuration**
   - The `.env` file is included in the repository with default values
   - For production, update the values as needed:
     ```env
     # Database Configuration
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=beyond_border_db
     DB_PORT=3306

     # JWT Configuration
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     JWT_EXPIRES_IN=7d

     # Server Configuration
     PORT=3000
     NODE_ENV=development

     # CORS Configuration
     CORS_ORIGIN=http://localhost:3000
     ```

5. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

6. **View API Documentation**
   - Open your browser and go to `http://localhost:3000`
   - Or directly access: `http://localhost:3000/api-docs`
   - The Swagger UI provides interactive API testing capabilities

## API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get user profile (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
beyond-border-backend/
├── config/
│   ├── database.js          # Database configuration and connection
│   └── swagger.js           # Swagger/OpenAPI documentation configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation middleware
├── models/
│   └── User.js             # User model and database operations
├── routes/
│   └── auth.js             # Authentication routes with Swagger docs
├── scripts/
│   └── init-db.js          # Database initialization script
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── .cursorignore          # Cursor ignore rules
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── setup.js               # Setup script
├── test-api.js            # API testing script
└── README.md             # This file
```

## Security Features

- **Password Hashing**: Uses bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Prevents abuse with request rate limiting
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection against common vulnerabilities

## API Documentation Features

- **Interactive Swagger UI**: Professional documentation interface at `/api-docs`
- **Complete API Coverage**: All endpoints documented with examples
- **Request/Response Schemas**: Detailed schema definitions for all data models
- **Authentication Support**: Built-in JWT token testing in Swagger UI
- **Multiple Examples**: Different request examples for each endpoint
- **Error Documentation**: Comprehensive error response documentation
- **Auto-generated**: Documentation automatically updates with code changes

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'admin',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Development

- The application automatically creates database tables on startup
- Uses connection pooling for better database performance
- Includes comprehensive error handling and logging
- Follows RESTful API conventions

## Production Deployment

1. Update environment variables for production
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use a process manager like PM2
6. Set up proper logging and monitoring

## License

ISC
