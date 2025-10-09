# Team Management System Guide

## Overview

The Team Management System is a comprehensive solution for managing team members in your Beyond Border application. It provides both admin and public endpoints for team member management with full CRUD operations, pagination, filtering, and professional documentation.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [API Endpoints](#api-endpoints)
3. [Database Schema](#database-schema)
4. [Usage Examples](#usage-examples)
5. [Validation Rules](#validation-rules)
6. [Testing](#testing)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## System Architecture

### Components

- **Team Model** (`models/Team.js`): Database operations and business logic
- **Team Controller** (`controllers/teamController.js`): Request handling and response management
- **Team Routes** (`routes/team.js`): API endpoint definitions with Swagger documentation
- **Validation Middleware** (`middleware/validation.js`): Input validation for team operations
- **Database Schema**: MySQL table with optimized indexes

### Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete team members
- ✅ **Pagination**: Efficient pagination for large datasets
- ✅ **Filtering**: Filter by status, management level, department, and search
- ✅ **Public API**: Public endpoint for active team members
- ✅ **Statistics**: Team statistics and analytics
- ✅ **Validation**: Comprehensive input validation
- ✅ **Security**: Admin-only operations with JWT authentication
- ✅ **Documentation**: Complete Swagger API documentation

## API Endpoints

### Base URL: `/api/teams`

| Method | Endpoint | Description | Auth Required | Public |
|--------|----------|-------------|---------------|---------|
| POST | `/` | Create team member | Yes (Admin) | No |
| GET | `/` | Get all team members (paginated) | Yes (Admin) | No |
| GET | `/stats` | Get team statistics | Yes (Admin) | No |
| GET | `/{id}` | Get team member by ID | Yes (Admin) | No |
| PUT | `/{id}` | Update team member | Yes (Admin) | No |
| DELETE | `/{id}` | Delete team member | Yes (Admin) | No |
| GET | `/public/active` | Get active team members | No | Yes |

### Request/Response Examples

#### Create Team Member

**Request:**
```bash
POST /api/teams
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "designation": "Senior Developer",
  "status": "active",
  "isManagement": false,
  "phoneNumber": "+1-555-0123",
  "department": "Engineering",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "facebookUrl": "https://facebook.com/johndoe",
  "twitterUrl": "https://twitter.com/johndoe",
  "instagramUrl": "https://instagram.com/johndoe",
  "redditUrl": "https://reddit.com/u/johndoe",
  "description": "Experienced developer with 5+ years in web technologies"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Team member created successfully",
  "data": {
    "teamMember": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "designation": "Senior Developer",
      "status": "active",
      "isManagement": false,
      "phoneNumber": "+1-555-0123",
      "department": "Engineering",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "facebookUrl": "https://facebook.com/johndoe",
      "twitterUrl": "https://twitter.com/johndoe",
      "instagramUrl": "https://instagram.com/johndoe",
      "redditUrl": "https://reddit.com/u/johndoe",
      "description": "Experienced developer with 5+ years in web technologies",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get Team Members with Pagination

**Request:**
```bash
GET /api/teams?page=1&pageSize=10&status=active&isManagement=false&department=Engineering&search=John
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Team members retrieved successfully",
  "data": {
    "teams": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "designation": "Senior Developer",
        "status": "active",
        "isManagement": false,
        "department": "Engineering",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### Get Active Team Members (Public)

**Request:**
```bash
GET /api/teams/public/active
```

**Response:**
```json
{
  "success": true,
  "message": "Active team members retrieved successfully",
  "data": {
    "teamMembers": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://example.com/avatar.jpg",
        "designation": "Senior Developer",
        "isManagement": false,
        "phoneNumber": "+1-555-0123",
        "department": "Engineering",
        "linkedinUrl": "https://linkedin.com/in/johndoe",
        "description": "Experienced developer with 5+ years in web technologies"
      }
    ]
  }
}
```

## Database Schema

### Teams Table

```sql
CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(500),
  designation VARCHAR(100) NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  isManagement BOOLEAN DEFAULT FALSE,
  phoneNumber VARCHAR(50),
  department VARCHAR(100),
  linkedinUrl VARCHAR(500),
  facebookUrl VARCHAR(500),
  twitterUrl VARCHAR(500),
  instagramUrl VARCHAR(500),
  redditUrl VARCHAR(500),
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_isManagement (isManagement),
  INDEX idx_department (department),
  INDEX idx_email (email),
  INDEX idx_createdAt (createdAt)
);
```

### Field Descriptions

#### Required Fields
- **name**: Team member's full name (2-100 characters)
- **email**: Unique email address
- **designation**: Job title/position (2-100 characters)

#### Optional Fields
- **avatar**: Profile image URL (max 500 characters)
- **status**: active/inactive (default: active)
- **isManagement**: Boolean flag for management members (default: false)
- **phoneNumber**: Contact phone number
- **department**: Department/division name
- **linkedinUrl**: LinkedIn profile URL
- **facebookUrl**: Facebook profile URL
- **twitterUrl**: Twitter/X profile URL
- **instagramUrl**: Instagram profile URL
- **redditUrl**: Reddit profile URL
- **description**: Bio/description (max 1000 characters)

## Usage Examples

### Frontend Integration

#### React/JavaScript Example

```javascript
// Create team member
const createTeamMember = async (teamData) => {
  try {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(teamData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
};

// Get team members with pagination
const getTeamMembers = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters
    });
    
    const response = await fetch(`/api/teams?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

// Get active team members (public)
const getActiveTeamMembers = async () => {
  try {
    const response = await fetch('/api/teams/public/active');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching active team members:', error);
    throw error;
  }
};
```

#### Vue.js Example

```javascript
// Vue.js composable
import { ref, reactive } from 'vue';

export function useTeamManagement() {
  const loading = ref(false);
  const error = ref(null);
  const teamMembers = ref([]);
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    pages: 0
  });

  const fetchTeamMembers = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...filters
      });
      
      const response = await fetch(`/api/teams?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        teamMembers.value = result.data.teams;
        Object.assign(pagination, result.data.pagination);
      } else {
        error.value = result.message;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createTeamMember = async (teamData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(teamData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchTeamMembers(); // Refresh the list
        return result;
      } else {
        error.value = result.message;
        throw new Error(result.message);
      }
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
    teamMembers,
    pagination,
    fetchTeamMembers,
    createTeamMember
  };
}
```

### Backend Integration

#### Express.js Middleware

```javascript
// Middleware to log team member changes
const teamChangeLogger = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`Team member ${action}:`, {
          id: req.params.id,
          user: req.user?.email,
          timestamp: new Date().toISOString()
        });
      }
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Usage
app.put('/api/teams/:id', 
  authenticateToken, 
  requireRole(['admin']), 
  teamChangeLogger('updated'),
  updateTeamMember
);
```

## Validation Rules

### Required Fields
- **name**: 2-100 characters, letters and spaces only
- **email**: Valid email format
- **designation**: 2-100 characters

### Optional Fields
- **avatar**: Valid string (URL)
- **status**: 'active' or 'inactive'
- **isManagement**: Boolean
- **phoneNumber**: Valid mobile phone format
- **department**: Max 100 characters
- **linkedinUrl**: Valid URL format
- **facebookUrl**: Valid URL format
- **twitterUrl**: Valid URL format
- **instagramUrl**: Valid URL format
- **redditUrl**: Valid URL format
- **description**: Max 1000 characters

### Validation Examples

```javascript
// Valid team member data
const validTeamMember = {
  name: "John Doe",
  email: "john@example.com",
  designation: "Senior Developer",
  status: "active",
  isManagement: false,
  phoneNumber: "+1-555-0123",
  department: "Engineering",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  description: "Experienced developer with 5+ years in web technologies"
};

// Invalid data (will be rejected)
const invalidTeamMember = {
  name: "J", // Too short
  email: "invalid-email", // Invalid format
  designation: "D" // Too short
};
```

## Testing

### Run Team API Tests

```bash
# Test all team endpoints
npm run test-team

# Test specific functionality
node test-team-api.js
```

### Test Coverage

The test suite covers:
- ✅ **Authentication**: Login and token validation
- ✅ **CRUD Operations**: Create, Read, Update, Delete
- ✅ **Pagination**: Page navigation and size limits
- ✅ **Filtering**: Status, management, department, search filters
- ✅ **Public API**: Active team members endpoint
- ✅ **Statistics**: Team analytics and reporting
- ✅ **Validation**: Input validation and error handling
- ✅ **Security**: Unauthorized access prevention
- ✅ **Error Handling**: Graceful error responses

### Manual Testing

```bash
# 1. Start the server
npm run dev

# 2. Test health endpoint
curl http://localhost:3000/health

# 3. Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# 4. Create team member (use token from login)
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "designation": "Senior Developer"
  }'

# 5. Get team members
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/teams

# 6. Get active team members (public)
curl http://localhost:3000/api/teams/public/active
```

## Best Practices

### 1. Data Management

```javascript
// Always validate input data
const validateTeamMember = (data) => {
  const errors = [];
  
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.designation || data.designation.length < 2) {
    errors.push('Designation must be at least 2 characters');
  }
  
  return errors;
};
```

### 2. Error Handling

```javascript
// Graceful error handling
const handleTeamError = (error, res) => {
  console.error('Team operation error:', error);
  
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

### 3. Performance Optimization

```javascript
// Use pagination for large datasets
const getTeamMembers = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  
  // Use LIMIT and OFFSET for efficient pagination
  const query = `
    SELECT * FROM teams 
    WHERE status = 'active' 
    ORDER BY isManagement DESC, name ASC 
    LIMIT ${pageSize} OFFSET ${offset}
  `;
  
  return await pool.execute(query);
};
```

### 4. Security

```javascript
// Always authenticate admin operations
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Sanitize input data
const sanitizeTeamData = (data) => {
  return {
    name: data.name?.trim(),
    email: data.email?.toLowerCase().trim(),
    designation: data.designation?.trim(),
    // ... sanitize other fields
  };
};
```

## Troubleshooting

### Common Issues

#### 1. "Email already exists" Error

**Problem:** Trying to create a team member with an existing email.

**Solution:**
```javascript
// Check if email exists before creating
const existingMember = await Team.findByEmail(email);
if (existingMember) {
  return res.status(409).json({
    success: false,
    message: 'Email already exists'
  });
}
```

#### 2. "Validation failed" Error

**Problem:** Invalid input data format.

**Solution:**
```javascript
// Ensure all required fields are provided
const requiredFields = ['name', 'email', 'designation'];
const missingFields = requiredFields.filter(field => !data[field]);

if (missingFields.length > 0) {
  return res.status(400).json({
    success: false,
    message: `Missing required fields: ${missingFields.join(', ')}`
  });
}
```

#### 3. "Unauthorized" Error

**Problem:** Missing or invalid authentication token.

**Solution:**
```javascript
// Ensure token is provided and valid
const token = req.headers.authorization?.split(' ')[1];
if (!token) {
  return res.status(401).json({
    success: false,
    message: 'Access token required'
  });
}
```

#### 4. Pagination Issues

**Problem:** Incorrect pagination parameters.

**Solution:**
```javascript
// Validate pagination parameters
const page = Math.max(1, parseInt(req.query.page) || 1);
const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 10));
```

### Debug Mode

Enable debug logging:

```javascript
// In your environment
DEBUG=team:*
npm run dev

// Or add debug logging
console.log('Team operation:', {
  action: 'create',
  data: teamData,
  user: req.user?.email,
  timestamp: new Date().toISOString()
});
```

### Performance Monitoring

```javascript
// Monitor team operations
const teamMetrics = {
  createCount: 0,
  updateCount: 0,
  deleteCount: 0,
  averageResponseTime: 0
};

// Track metrics
const trackTeamOperation = (operation, startTime) => {
  const duration = Date.now() - startTime;
  teamMetrics[`${operation}Count`]++;
  teamMetrics.averageResponseTime = 
    (teamMetrics.averageResponseTime + duration) / 2;
};
```

## Support

For additional support or questions about the team management system:

1. **Check the Swagger documentation** at `/api-docs`
2. **Review the API examples** in this guide
3. **Run the test suite** with `npm run test-team`
4. **Check the application logs** for detailed error messages
5. **Verify database connection** with `npm run test-db`

## Changelog

### Version 1.0.0
- Initial release of team management system
- Full CRUD operations for team members
- Pagination and filtering support
- Public API for active team members
- Comprehensive validation and error handling
- Complete Swagger documentation
- Test suite with 100% endpoint coverage

---

Your team management system is now ready! 🚀

The system provides a professional, scalable solution for managing team members with both admin and public interfaces, complete with comprehensive documentation and testing.
