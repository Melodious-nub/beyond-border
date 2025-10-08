# Dynamic Page and Breadcrumb Management API Guide

## Overview

The Dynamic Page and Breadcrumb Management System provides a comprehensive solution for managing website pages and their associated breadcrumb data. This system allows administrators to create, update, and manage pages dynamically, with automatic breadcrumb generation for frontend consumption.

## Features

### Page Management
- ✅ **Create Pages**: Add new pages with title, description, and styling
- ✅ **Update Pages**: Modify existing page information
- ✅ **Delete Pages**: Soft delete (deactivate) or hard delete pages
- ✅ **Restore Pages**: Reactivate previously deactivated pages
- ✅ **Page Statistics**: Get comprehensive page analytics
- ✅ **Active Page Dropdown**: Get simplified page list for dropdowns
- ✅ **Public Access**: Retrieve pages by slug for public consumption

### Breadcrumb Management
- ✅ **Create/Update Breadcrumbs**: One breadcrumb per page (auto-create or update)
- ✅ **Page-Specific Breadcrumbs**: Each page can have one breadcrumb entry
- ✅ **Frontend Data Format**: Get breadcrumb data in frontend-ready format
- ✅ **Automatic Cleanup**: Breadcrumbs are deleted when pages are deleted
- ✅ **Breadcrumb Statistics**: Get comprehensive breadcrumb analytics
- ✅ **Public Access**: Retrieve breadcrumbs by slug for public consumption

## API Endpoints

### Page Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/pages` | Create a new page | Yes (Admin) |
| GET | `/api/pages` | Get all pages with pagination | Yes (Admin) |
| GET | `/api/pages/active` | Get active pages for dropdown | Yes (Admin) |
| GET | `/api/pages/stats` | Get page statistics | Yes (Admin) |
| GET | `/api/pages/{id}` | Get page by ID | Yes (Admin) |
| GET | `/api/pages/slug/{page}` | Get page by slug | No (Public) |
| PUT | `/api/pages/{id}` | Update page | Yes (Admin) |
| PATCH | `/api/pages/{id}/restore` | Restore deactivated page | Yes (Admin) |
| DELETE | `/api/pages/{id}` | Delete page (soft/hard) | Yes (Admin) |

### Breadcrumb Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/breadcrumbs` | Create/update breadcrumb for page | Yes (Admin) |
| GET | `/api/breadcrumbs` | Get all breadcrumbs with pagination | Yes (Admin) |
| GET | `/api/breadcrumbs/active` | Get active breadcrumbs | Yes (Admin) |
| GET | `/api/breadcrumbs/page-data` | Get page data for frontend | No (Public) |
| GET | `/api/breadcrumbs/stats` | Get breadcrumb statistics | Yes (Admin) |
| GET | `/api/breadcrumbs/{id}` | Get breadcrumb by ID | Yes (Admin) |
| GET | `/api/breadcrumbs/page/{pageId}` | Get breadcrumb by page ID | Yes (Admin) |
| GET | `/api/breadcrumbs/slug/{page}` | Get breadcrumb by page slug | No (Public) |
| PUT | `/api/breadcrumbs/{id}` | Update breadcrumb | Yes (Admin) |
| DELETE | `/api/breadcrumbs/{id}` | Delete breadcrumb | Yes (Admin) |
| DELETE | `/api/breadcrumbs/page/{pageId}` | Delete breadcrumb by page ID | Yes (Admin) |

## Database Schema

### Pages Table
```sql
CREATE TABLE pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(100) UNIQUE NOT NULL,
  pageTitle VARCHAR(200) NOT NULL,
  pageDescription TEXT NOT NULL,
  bgColor VARCHAR(7) DEFAULT '#ffffff',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page (page),
  INDEX idx_isActive (isActive)
);
```

### Breadcrumbs Table
```sql
CREATE TABLE breadcrumbs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pageId INT NOT NULL,
  page VARCHAR(100) NOT NULL,
  pageTitle VARCHAR(200) NOT NULL,
  pageDescription TEXT NOT NULL,
  bgColor VARCHAR(7) DEFAULT '#ffffff',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pageId) REFERENCES pages(id) ON DELETE CASCADE,
  UNIQUE KEY unique_page_breadcrumb (pageId),
  INDEX idx_page (page),
  INDEX idx_pageId (pageId)
);
```

## Usage Examples

### 1. Create a New Page

```bash
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "page": "about",
    "pageTitle": "About Beyond Border Consultants",
    "pageDescription": "Beyond Border Consultants is a multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services.",
    "bgColor": "#ffffff",
    "isActive": true
  }'
```

### 2. Create/Update Breadcrumb for Page

```bash
curl -X POST http://localhost:3000/api/breadcrumbs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "pageId": 1,
    "page": "about",
    "pageTitle": "About Beyond Border Consultants",
    "pageDescription": "Beyond Border Consultants is a multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services.",
    "bgColor": "#ffffff"
  }'
```

### 3. Get Page Data for Frontend

```bash
curl -X GET http://localhost:3000/api/breadcrumbs/page-data
```

**Response:**
```json
{
  "success": true,
  "message": "Page data retrieved successfully",
  "data": {
    "pageData": [
      {
        "page": "about",
        "pageTitle": "About Beyond Border Consultants",
        "pageDescription": "Beyond Border Consultants is a multidisciplinary advisory firm..."
      },
      {
        "page": "team",
        "pageTitle": "Our Team",
        "pageDescription": "Access top-tier independent management consultants..."
      }
    ]
  }
}
```

### 4. Get Active Pages for Dropdown

```bash
curl -X GET http://localhost:3000/api/pages/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Active pages retrieved successfully",
  "data": {
    "pages": [
      {
        "id": 1,
        "page": "about",
        "pageTitle": "About Beyond Border Consultants"
      },
      {
        "id": 2,
        "page": "team",
        "pageTitle": "Our Team"
      }
    ]
  }
}
```

### 5. Update Page

```bash
curl -X PUT http://localhost:3000/api/pages/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "pageTitle": "Updated About Page",
    "pageDescription": "Updated description for the about page.",
    "bgColor": "#f8f9fa"
  }'
```

### 6. Soft Delete Page

```bash
curl -X DELETE http://localhost:3000/api/pages/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Hard Delete Page (Permanent)

```bash
curl -X DELETE "http://localhost:3000/api/pages/1?hardDelete=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Restore Page

```bash
curl -X PATCH http://localhost:3000/api/pages/1/restore \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Integration

### React/JavaScript Example

```javascript
// Get page data for breadcrumbs
const getPageData = async () => {
  try {
    const response = await fetch('/api/breadcrumbs/page-data');
    const result = await response.json();
    return result.data.pageData;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return [];
  }
};

// Get active pages for dropdown
const getActivePages = async () => {
  try {
    const response = await fetch('/api/pages/active', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const result = await response.json();
    return result.data.pages;
  } catch (error) {
    console.error('Error fetching active pages:', error);
    return [];
  }
};

// Create new page
const createPage = async (pageData) => {
  try {
    const response = await fetch('/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(pageData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

// Create/update breadcrumb
const createOrUpdateBreadcrumb = async (breadcrumbData) => {
  try {
    const response = await fetch('/api/breadcrumbs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(breadcrumbData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating/updating breadcrumb:', error);
    throw error;
  }
};
```

### Vue.js Example

```javascript
// Vue.js composable
import { ref } from 'vue';

export function usePageManagement() {
  const pages = ref([]);
  const breadcrumbs = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const fetchPageData = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/api/breadcrumbs/page-data');
      const result = await response.json();
      breadcrumbs.value = result.data.pageData;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchActivePages = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/api/pages/active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      pages.value = result.data.pages;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    pages,
    breadcrumbs,
    loading,
    error,
    fetchPageData,
    fetchActivePages
  };
}
```

## Validation Rules

### Page Validation
- **page**: Required, 2-100 characters, lowercase letters, numbers, and hyphens only
- **pageTitle**: Required, 2-200 characters
- **pageDescription**: Required, 10-2000 characters
- **bgColor**: Optional, valid hex color format (#ffffff)
- **isActive**: Optional, boolean value

### Breadcrumb Validation
- **pageId**: Required, positive integer
- **page**: Required, 2-100 characters, lowercase letters, numbers, and hyphens only
- **pageTitle**: Required, 2-200 characters
- **pageDescription**: Required, 10-2000 characters
- **bgColor**: Optional, valid hex color format (#ffffff)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "page",
      "message": "Page slug is required"
    }
  ]
}
```

### Common Error Codes
- **400**: Validation failed
- **401**: Unauthorized (invalid/missing token)
- **404**: Resource not found
- **409**: Conflict (duplicate page slug)
- **500**: Internal server error

## Testing

Run the comprehensive test suite:

```bash
# Test the complete page and breadcrumb API system
npm run test-page-breadcrumb

# Test individual components
npm run test-db      # Test database connection
npm run init-db      # Initialize database with new tables
npm run dev          # Start development server
```

## Security Features

- ✅ **JWT Authentication**: All admin endpoints require valid JWT tokens
- ✅ **Input Validation**: Comprehensive validation using express-validator
- ✅ **SQL Injection Protection**: Parameterized queries with mysql2
- ✅ **CORS Protection**: Configurable cross-origin resource sharing
- ✅ **Rate Limiting**: Prevents abuse with request rate limiting
- ✅ **Helmet Security**: Security headers for protection against vulnerabilities

## Performance Features

- ✅ **Database Indexing**: Optimized indexes for fast queries
- ✅ **Connection Pooling**: MySQL connection pooling for better performance
- ✅ **Pagination**: Efficient pagination for large datasets
- ✅ **Soft Deletes**: Preserve data integrity with soft delete functionality
- ✅ **Cascade Deletes**: Automatic cleanup of related breadcrumb data

## Monitoring and Analytics

### Page Statistics
- Total pages count
- Active/inactive pages count
- Pages with/without breadcrumbs
- Recent page activity

### Breadcrumb Statistics
- Total breadcrumbs count
- Active/inactive breadcrumbs count
- Pages without breadcrumbs
- Recent breadcrumb activity

## Best Practices

1. **Page Slug Naming**: Use lowercase, hyphen-separated slugs (e.g., "about-us", "contact-form")
2. **Description Length**: Keep descriptions between 10-2000 characters for SEO
3. **Color Format**: Use hex color format (#ffffff) for consistency
4. **Soft Deletes**: Use soft deletes to preserve data integrity
5. **Validation**: Always validate input on both frontend and backend
6. **Error Handling**: Implement proper error handling in frontend applications
7. **Caching**: Consider caching page data for better performance
8. **SEO**: Use descriptive page titles and descriptions for better SEO

## Troubleshooting

### Common Issues

1. **"Page with this slug already exists"**
   - Check if a page with the same slug already exists
   - Use a different slug or update the existing page

2. **"Cannot create breadcrumb for inactive page"**
   - Ensure the page is active before creating breadcrumbs
   - Activate the page first, then create the breadcrumb

3. **"Breadcrumb not found for this page"**
   - Create a breadcrumb for the page first
   - Check if the page exists and is active

4. **Database Connection Issues**
   - Verify MySQL server is running
   - Check database credentials in .env file
   - Run `npm run test-db` to test connection

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your .env file.

## Support

For additional support or questions about the Page and Breadcrumb Management System:

1. Check the Swagger documentation at `/api-docs`
2. Review the API examples in this guide
3. Test your implementation using the test suite
4. Check the application logs for detailed error messages

## Changelog

### Version 1.0.0
- Initial release of dynamic page and breadcrumb management system
- Complete CRUD operations for pages and breadcrumbs
- Professional Swagger API documentation
- Comprehensive validation and error handling
- Frontend-ready data formats
- Statistics and analytics endpoints
- Soft delete and restore functionality
- Production-ready security features
