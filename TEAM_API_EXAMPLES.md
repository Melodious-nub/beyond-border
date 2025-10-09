# Team Management API - Usage Examples

## Overview

The Team Management API now supports multipart form data for file uploads and has simplified validation that only requires the mandatory fields.

## Required Fields Only

You can create a team member with just the required fields:

### JavaScript/Fetch Example

```javascript
// Create team member with only required fields
const createTeamMember = async (teamData) => {
  const formData = new FormData();
  formData.append('name', teamData.name);
  formData.append('email', teamData.email);
  formData.append('designation', teamData.designation);
  
  // Optional: Add avatar file
  if (teamData.avatar) {
    formData.append('avatar', teamData.avatar);
  }

  const response = await fetch('/api/teams', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// Usage
const teamMember = await createTeamMember({
  name: 'John Doe',
  email: 'john@example.com',
  designation: 'Senior Developer'
});
```

### cURL Example

```bash
# Create team member with required fields only
curl -X POST http://localhost:3000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "designation=Senior Developer"

# Create team member with avatar file
curl -X POST http://localhost:3000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "designation=Senior Developer" \
  -F "avatar=@/path/to/avatar.jpg"
```

### React Example

```jsx
import React, { useState } from 'react';

const CreateTeamMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: ''
  });
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('designation', formData.designation);
    
    if (avatar) {
      data.append('avatar', avatar);
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });

      const result = await response.json();
      if (result.success) {
        console.log('Team member created:', result.data.teamMember);
      }
    } catch (error) {
      console.error('Error creating team member:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Designation"
        value={formData.designation}
        onChange={(e) => setFormData({...formData, designation: e.target.value})}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatar(e.target.files[0])}
      />
      <button type="submit">Create Team Member</button>
    </form>
  );
};
```

## With Optional Fields

You can also include optional fields without strict validation:

```javascript
const createTeamMemberWithOptional = async (teamData) => {
  const formData = new FormData();
  
  // Required fields
  formData.append('name', teamData.name);
  formData.append('email', teamData.email);
  formData.append('designation', teamData.designation);
  
  // Optional fields (no validation required)
  if (teamData.avatar) formData.append('avatar', teamData.avatar);
  if (teamData.status) formData.append('status', teamData.status);
  if (teamData.isManagement) formData.append('isManagement', teamData.isManagement);
  if (teamData.phoneNumber) formData.append('phoneNumber', teamData.phoneNumber);
  if (teamData.department) formData.append('department', teamData.department);
  if (teamData.linkedinUrl) formData.append('linkedinUrl', teamData.linkedinUrl);
  if (teamData.facebookUrl) formData.append('facebookUrl', teamData.facebookUrl);
  if (teamData.twitterUrl) formData.append('twitterUrl', teamData.twitterUrl);
  if (teamData.instagramUrl) formData.append('instagramUrl', teamData.instagramUrl);
  if (teamData.redditUrl) formData.append('redditUrl', teamData.redditUrl);
  if (teamData.description) formData.append('description', teamData.description);

  const response = await fetch('/api/teams', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};
```

## File Upload Specifications

- **File Field Name**: `avatar`
- **File Size Limit**: 500KB
- **Accepted Formats**: Image files only (jpg, png, gif, etc.)
- **Storage Location**: `uploads/avatars/`
- **File Naming**: `avatar-{timestamp}-{random}.{extension}`

## API Response Examples

### Success Response

```json
{
  "success": true,
  "message": "Team member created successfully",
  "data": {
    "teamMember": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "uploads/avatars/avatar-1234567890-123456789.jpg",
      "designation": "Senior Developer",
      "status": "active",
      "isManagement": false,
      "phoneNumber": null,
      "department": null,
      "linkedinUrl": null,
      "facebookUrl": null,
      "twitterUrl": null,
      "instagramUrl": null,
      "redditUrl": null,
      "description": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Update Team Member with File Upload

You can update team members and change their avatar:

### JavaScript/Fetch Example

```javascript
// Update team member with new avatar
const updateTeamMember = async (id, teamData, avatarFile) => {
  const formData = new FormData();
  
  // Add fields to update
  if (teamData.name) formData.append('name', teamData.name);
  if (teamData.email) formData.append('email', teamData.email);
  if (teamData.designation) formData.append('designation', teamData.designation);
  if (teamData.status) formData.append('status', teamData.status);
  if (teamData.isManagement !== undefined) formData.append('isManagement', teamData.isManagement);
  if (teamData.phoneNumber) formData.append('phoneNumber', teamData.phoneNumber);
  if (teamData.department) formData.append('department', teamData.department);
  if (teamData.linkedinUrl) formData.append('linkedinUrl', teamData.linkedinUrl);
  if (teamData.description) formData.append('description', teamData.description);
  
  // Add new avatar file
  if (avatarFile) {
    formData.append('avatar', avatarFile);
  }

  const response = await fetch(`/api/teams/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// Usage
const updatedMember = await updateTeamMember(1, {
  name: 'John Updated Doe',
  designation: 'Lead Developer',
  isManagement: true,
  department: 'Engineering'
}, avatarFile);
```

### cURL Example

```bash
# Update team member with new avatar
curl -X PUT http://localhost:3000/api/teams/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=John Updated Doe" \
  -F "designation=Lead Developer" \
  -F "isManagement=true" \
  -F "department=Engineering" \
  -F "avatar=@/path/to/new-avatar.jpg"
```

## Avatar Image Access - Simplified!

**No need for separate API calls!** Avatar URLs are now included directly in all team member responses.

### API Response Example

```json
{
  "success": true,
  "message": "Team members retrieved successfully",
  "data": {
    "teamMembers": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "avatarUrl": "http://localhost:3000/uploads/avatars/avatar-1234567890-123456789.jpg",
        "designation": "Senior Developer",
        "status": "active",
        "isManagement": false,
        "department": "Engineering",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Frontend Usage - Super Simple!

```jsx
// React component - just use the avatarUrl directly!
const TeamMemberCard = ({ member }) => {
  return (
    <div className="team-member-card">
      <img 
        src={member.avatarUrl || '/default-avatar.png'} 
        alt={member.name}
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />
      <h3>{member.name}</h3>
      <p>{member.designation}</p>
    </div>
  );
};
```

### HTML Example - Direct Usage

```html
<!-- Just use the avatarUrl from the API response! -->
<img src="http://localhost:3000/uploads/avatars/avatar-1234567890-123456789.jpg" 
     alt="Team Member Avatar" 
     style="width: 150px; height: 150px; border-radius: 50%;" />
```

### JavaScript Example

```javascript
// Fetch team members and display with avatars
const fetchTeamMembers = async () => {
  const response = await fetch('/api/teams/public/active');
  const data = await response.json();
  
  data.data.teamMembers.forEach(member => {
    console.log(`${member.name}: ${member.avatarUrl || 'No avatar'}`);
    // member.avatarUrl is ready to use directly!
  });
};
```

## Testing the API

Run the test suite to verify everything works:

```bash
# Install dependencies
npm install

# Start the server
npm run dev

# Run team API tests
npm run test-team
```

## Key Changes Made

1. **Simplified Validation**: Only required fields (name, email, designation) are validated
2. **Multipart Form Support**: Added multer middleware for file uploads
3. **Optional Fields**: No validation on optional fields - they can be blank or invalid
4. **File Upload**: Avatar field accepts image files up to 500KB
5. **Flexible Input**: Can create team members with minimal data

## Required Fields

- `name` (string, 2-100 characters)
- `email` (string, valid email format)
- `designation` (string, 2-100 characters)

## Optional Fields (No Validation)

- `avatar` (file, max 500KB)
- `status` (string: 'active' or 'inactive')
- `isManagement` (boolean)
- `phoneNumber` (string)
- `department` (string)
- `linkedinUrl` (string)
- `facebookUrl` (string)
- `twitterUrl` (string)
- `instagramUrl` (string)
- `redditUrl` (string)
- `description` (string, max 1000 characters)

This makes the API much more flexible and user-friendly! 🚀
