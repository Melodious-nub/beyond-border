# Beyond Border Backend

A professional Express.js backend application for website maintenance management with MySQL database integration.

## Features

- **Authentication System**: Complete JWT-based authentication with register, login, and profile management
- **Contact Form Management**: Public contact form with admin dashboard for message management
- **Notification Management System**: Centralized email notification system for receiving alerts from various forms and system events
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

### Contact Form
- `POST /api/contact` - Submit contact form (Public)
- `GET /api/contact` - Get all contact messages with pagination (Admin)

### Notification Management System
- `POST /api/notifications/emails` - Add notification email (Admin)
- `GET /api/notifications/emails` - List all notification emails (Admin)
- `DELETE /api/notifications/emails/{email}` - Delete notification email (Admin)
- `POST /api/notifications/test-email` - Test email configuration (Admin)
- `POST /api/notifications/send` - Send custom notification to all configured emails (Admin)

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

### Submit contact form (Public)
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "description": "I would like to discuss a potential project with your team."
  }'
```

### Get all contact messages (Admin)
```bash
curl -X GET http://localhost:3000/api/contact \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add notification email (Admin)
```bash
curl -X POST http://localhost:3000/api/notifications/emails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "admin@example.com"
  }'
```

### List notification emails (Admin)
```bash
curl -X GET http://localhost:3000/api/notifications/emails \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Send custom notification (Admin)
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subject": "System Alert",
    "message": "This is a custom notification message."
  }'
```

### Test email configuration (Admin)
```bash
curl -X POST http://localhost:3000/api/notifications/test-email \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
beyond-border-backend/
├── config/
│   ├── database.js          # Database configuration and connection
│   └── swagger.js           # Swagger/OpenAPI documentation configuration
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── contactController.js     # Contact form logic
│   └── notificationController.js # Notification management logic
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation middleware
├── models/
│   ├── User.js             # User model and database operations
│   ├── Contact.js          # Contact model and database operations
│   └── NotificationEmail.js # Notification email management model
├── routes/
│   ├── auth.js             # Authentication routes with Swagger docs
│   ├── contact.js          # Contact form routes with Swagger docs
│   └── notification.js     # Notification management routes with Swagger docs
├── services/
│   └── emailService.js     # Email notification service
├── scripts/
│   └── init-db.js          # Database initialization script
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── .cursorignore          # Cursor ignore rules
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── setup.js               # Setup script
├── test-api.js            # API testing script
├── test-contact-api.js    # Contact API testing script
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

### Contacts Table
```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Notification Emails Table
```sql
CREATE TABLE notification_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Notification Management System

The notification management system is a centralized solution for managing email notifications across your application. It's designed to be used with various forms and system events to ensure administrators are promptly notified of important activities.

### Key Features

- **Centralized Email Management**: Add, remove, and list notification email addresses
- **Multi-Form Support**: Can be integrated with contact forms, registration forms, and other system events
- **Custom Notifications**: Send custom notification messages to all configured email addresses
- **Email Testing**: Test email configuration to ensure proper delivery
- **Professional Templates**: Beautiful HTML email templates for all notifications

### Use Cases

1. **Contact Form Notifications**: Automatically notify administrators when new contact messages are received
2. **System Alerts**: Send notifications for system events, errors, or maintenance
3. **User Registration**: Notify administrators of new user registrations
4. **Custom Alerts**: Send custom messages for important announcements or updates

### Integration Example

To integrate the notification system with other forms, simply call the email service:

```javascript
const emailService = require('./services/emailService');

// Send notification for any form submission
await emailService.sendContactNotification({
  name: 'User Name',
  email: 'user@example.com',
  description: 'Form submission details',
  createdAt: new Date()
});
```

### Email Configuration

The system supports various email providers including:
- Gmail SMTP
- Outlook/Hotmail SMTP
- cPanel email accounts
- Custom SMTP servers

Configure your email settings in the `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Beyond Border
```

## Development

- The application automatically creates database tables on startup
- Uses connection pooling for better database performance
- Includes comprehensive error handling and logging
- Follows RESTful API conventions
- Modular notification system for easy integration with other forms

## Production Deployment

1. Update environment variables for production
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use a process manager like PM2
6. Set up proper logging and monitoring

## License

ISC
