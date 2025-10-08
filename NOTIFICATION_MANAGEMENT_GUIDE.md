# Notification Management System Guide

## Overview

The Notification Management System is a centralized solution for managing email notifications across your Beyond Border application. It provides a professional, scalable way to handle email notifications for various forms and system events.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [API Endpoints](#api-endpoints)
3. [Integration Guide](#integration-guide)
4. [Email Configuration](#email-configuration)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## System Architecture

### Components

- **Notification Controller** (`controllers/notificationController.js`): Handles all notification-related business logic
- **Notification Routes** (`routes/notification.js`): Defines API endpoints for notification management
- **Email Service** (`services/emailService.js`): Manages email sending and template generation
- **Notification Model** (`models/NotificationEmail.js`): Database operations for notification emails
- **Swagger Documentation**: Complete API documentation with examples

### Database Schema

```sql
CREATE TABLE notification_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Base URL: `/api/notifications`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/emails` | Add notification email | Yes (Admin) |
| GET | `/emails` | List all notification emails | Yes (Admin) |
| DELETE | `/emails/{email}` | Delete notification email | Yes (Admin) |
| POST | `/test-email` | Test email configuration | Yes (Admin) |
| POST | `/send` | Send custom notification | Yes (Admin) |

### Request/Response Examples

#### Add Notification Email

**Request:**
```bash
POST /api/notifications/emails
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "email": "admin@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification email added successfully",
  "data": {
    "notificationEmail": {
      "id": 1,
      "email": "admin@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Send Custom Notification

**Request:**
```bash
POST /api/notifications/send
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "subject": "System Maintenance Alert",
  "message": "Scheduled maintenance will begin at 2:00 AM UTC. Expected downtime: 30 minutes."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent to 3 email addresses",
  "data": {
    "sentCount": 3,
    "failedCount": 0,
    "totalConfigured": 3
  }
}
```

## Integration Guide

### Basic Integration

To integrate the notification system with your forms or system events:

```javascript
const emailService = require('./services/emailService');

// Example: Contact form submission
const handleContactSubmission = async (contactData) => {
  try {
    // Save contact to database
    const contact = await Contact.create(contactData);
    
    // Send notification to all configured emails
    const result = await emailService.sendContactNotification(contact.toJSON());
    
    if (result.success) {
      console.log('Notification sent successfully');
    } else {
      console.error('Failed to send notification:', result.message);
    }
    
    return contact;
  } catch (error) {
    console.error('Contact submission error:', error);
    throw error;
  }
};
```

### Custom Notification Integration

For custom notifications (not contact forms):

```javascript
const emailService = require('./services/emailService');

// Example: User registration notification
const notifyNewUserRegistration = async (userData) => {
  try {
    const result = await emailService.sendCustomNotification(
      'admin@example.com', // or get from notification emails list
      'New User Registration',
      `A new user has registered:\n\nName: ${userData.fullName}\nEmail: ${userData.email}\nRegistration Date: ${new Date().toLocaleString()}`
    );
    
    return result;
  } catch (error) {
    console.error('Registration notification error:', error);
    throw error;
  }
};
```

### Bulk Notification Integration

To send notifications to all configured emails:

```javascript
const NotificationEmail = require('./models/NotificationEmail');
const emailService = require('./services/emailService');

const sendBulkNotification = async (subject, message) => {
  try {
    const notificationEmails = await NotificationEmail.findAll();
    
    let sentCount = 0;
    let failedCount = 0;
    
    for (const notificationEmail of notificationEmails) {
      try {
        const result = await emailService.sendCustomNotification(
          notificationEmail.email,
          subject,
          message
        );
        
        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
        console.error(`Failed to send to ${notificationEmail.email}:`, error);
      }
    }
    
    return { sentCount, failedCount, totalConfigured: notificationEmails.length };
  } catch (error) {
    console.error('Bulk notification error:', error);
    throw error;
  }
};
```

## Email Configuration

### Environment Variables

Configure your email settings in the `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Beyond Border

# Optional: Fallback notification email
NOTIFICATION_EMAILS=admin@example.com
```

### Supported Email Providers

#### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use App Password, not regular password
```

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### cPanel Email
```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-email-password
```

#### Custom SMTP
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this app password in your `EMAIL_PASS` environment variable

## Usage Examples

### Frontend Integration

#### React/JavaScript Example

```javascript
// Add notification email
const addNotificationEmail = async (email) => {
  try {
    const response = await fetch('/api/notifications/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding notification email:', error);
    throw error;
  }
};

// Send custom notification
const sendNotification = async (subject, message) => {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ subject, message })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
```

#### Vue.js Example

```javascript
// Vue.js composable
import { ref } from 'vue';

export function useNotifications() {
  const loading = ref(false);
  const error = ref(null);
  
  const addNotificationEmail = async (email) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/api/notifications/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    loading,
    error,
    addNotificationEmail
  };
}
```

### Backend Integration

#### Express.js Middleware

```javascript
// Middleware to send notification on specific events
const notificationMiddleware = (eventType) => {
  return async (req, res, next) => {
    try {
      // Process the request first
      await next();
      
      // Send notification after successful processing
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const emailService = require('../services/emailService');
        
        let subject, message;
        
        switch (eventType) {
          case 'user_registration':
            subject = 'New User Registration';
            message = `A new user has registered: ${req.body.fullName} (${req.body.email})`;
            break;
          case 'contact_form':
            subject = 'New Contact Form Submission';
            message = `New contact from: ${req.body.name} (${req.body.email})`;
            break;
          default:
            subject = 'System Event';
            message = `Event: ${eventType}`;
        }
        
        // Send notification asynchronously (don't wait for it)
        emailService.sendCustomNotification(
          'admin@example.com', // or get from notification list
          subject,
          message
        ).catch(error => {
          console.error('Notification failed:', error);
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

// Usage
app.post('/api/register', notificationMiddleware('user_registration'), registerController);
```

## Best Practices

### 1. Error Handling

Always handle email sending errors gracefully:

```javascript
const sendNotificationSafely = async (emailData) => {
  try {
    const result = await emailService.sendContactNotification(emailData);
    
    if (!result.success) {
      console.error('Email notification failed:', result.message);
      // Don't fail the main operation if email fails
    }
  } catch (error) {
    console.error('Email service error:', error);
    // Log the error but don't throw it
  }
};
```

### 2. Rate Limiting

Implement rate limiting for notification endpoints:

```javascript
const rateLimit = require('express-rate-limit');

const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many notification requests, please try again later.'
  }
});

app.use('/api/notifications/send', notificationLimiter);
```

### 3. Email Validation

Always validate email addresses:

```javascript
const { body, validationResult } = require('express-validator');

const validateNotificationEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];
```

### 4. Async Processing

For high-volume applications, consider using a queue system:

```javascript
const Queue = require('bull');
const emailQueue = new Queue('email notifications');

// Add email to queue
emailQueue.add('send-notification', {
  to: 'admin@example.com',
  subject: 'New Contact Form',
  message: 'Contact form submitted'
});

// Process queue
emailQueue.process('send-notification', async (job) => {
  const { to, subject, message } = job.data;
  return await emailService.sendCustomNotification(to, subject, message);
});
```

## Troubleshooting

### Common Issues

#### 1. Email Not Sending

**Symptoms:** No emails received, no error messages

**Solutions:**
- Check email configuration in `.env`
- Verify SMTP credentials
- Test email configuration using `/api/notifications/test-email`
- Check spam folder
- Verify firewall settings

#### 2. Authentication Errors

**Symptoms:** "Authentication failed" or "Invalid credentials"

**Solutions:**
- For Gmail: Use App Password instead of regular password
- Enable "Less secure app access" (not recommended)
- Check 2FA settings
- Verify email address and password

#### 3. Connection Timeouts

**Symptoms:** "Connection timeout" or "ECONNREFUSED"

**Solutions:**
- Check EMAIL_HOST and EMAIL_PORT settings
- Verify network connectivity
- Check firewall settings
- Try different port (587, 465, 25)

#### 4. Rate Limiting

**Symptoms:** "Too many requests" errors

**Solutions:**
- Implement proper rate limiting
- Use email queues for bulk notifications
- Space out email sending
- Monitor email provider limits

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// In emailService.js
const transporter = nodemailer.createTransporter({
  // ... your config
  debug: true, // Enable debug mode
  logger: true // Enable logging
});
```

### Testing Email Configuration

Use the built-in test endpoint:

```bash
curl -X POST http://localhost:3000/api/notifications/test-email \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Monitoring

Set up monitoring for email delivery:

```javascript
// Add to your monitoring system
const monitorEmailDelivery = async () => {
  try {
    const result = await emailService.testEmailConfiguration();
    
    if (!result.success) {
      // Alert your monitoring system
      console.error('Email service is down:', result.message);
    }
  } catch (error) {
    console.error('Email monitoring failed:', error);
  }
};

// Run every 5 minutes
setInterval(monitorEmailDelivery, 5 * 60 * 1000);
```

## Support

For additional support or questions about the notification management system:

1. Check the Swagger documentation at `/api-docs`
2. Review the API examples in this guide
3. Test your configuration using the test endpoints
4. Check the application logs for detailed error messages

## Changelog

### Version 1.0.0
- Initial release of notification management system
- Support for contact form notifications
- Custom notification sending
- Email configuration testing
- Professional HTML email templates
- Complete API documentation
