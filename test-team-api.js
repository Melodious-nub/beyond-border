const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let createdTeamMemberId = null;

// Test data - only required fields
const testTeamMember = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  designation: 'Senior Developer'
};

// Optional fields for testing
const testTeamMemberWithOptional = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  designation: 'Lead Developer',
  status: 'active',
  isManagement: true,
  phoneNumber: '+1-555-0124',
  department: 'Engineering',
  linkedinUrl: 'https://linkedin.com/in/janesmith',
  description: 'Lead developer with 8+ years experience'
};

const updatedTeamMember = {
  name: 'John Updated Doe',
  designation: 'Lead Developer',
  isManagement: true,
  department: 'Engineering',
  description: 'Lead developer with 8+ years in web technologies'
};

async function loginAsAdmin() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });

    if (response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Admin login successful');
      return true;
    } else {
      console.log('❌ Admin login failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCreateTeamMember() {
  try {
    console.log('\n📝 Testing create team member (required fields only)...');
    
    // Test with only required fields
    const formData = new FormData();
    formData.append('name', testTeamMember.name);
    formData.append('email', testTeamMember.email);
    formData.append('designation', testTeamMember.designation);

    const response = await axios.post(`${BASE_URL}/api/teams`, formData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        ...formData.getHeaders()
      }
    });

    if (response.data.success) {
      createdTeamMemberId = response.data.data.teamMember.id;
      console.log('✅ Team member created successfully (required fields only)');
      console.log('   ID:', createdTeamMemberId);
      console.log('   Name:', response.data.data.teamMember.name);
      console.log('   Email:', response.data.data.teamMember.email);
      console.log('   Designation:', response.data.data.teamMember.designation);
      console.log('   Avatar URL:', response.data.data.teamMember.avatarUrl || 'No avatar');
      return true;
    } else {
      console.log('❌ Create team member failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Create team member error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCreateTeamMemberWithOptional() {
  try {
    console.log('\n📝 Testing create team member with optional fields...');
    
    const formData = new FormData();
    formData.append('name', testTeamMemberWithOptional.name);
    formData.append('email', testTeamMemberWithOptional.email);
    formData.append('designation', testTeamMemberWithOptional.designation);
    formData.append('status', testTeamMemberWithOptional.status);
    formData.append('isManagement', testTeamMemberWithOptional.isManagement.toString());
    formData.append('phoneNumber', testTeamMemberWithOptional.phoneNumber);
    formData.append('department', testTeamMemberWithOptional.department);
    formData.append('linkedinUrl', testTeamMemberWithOptional.linkedinUrl);
    formData.append('description', testTeamMemberWithOptional.description);

    const response = await axios.post(`${BASE_URL}/api/teams`, formData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        ...formData.getHeaders()
      }
    });

    if (response.data.success) {
      console.log('✅ Team member created successfully with optional fields');
      console.log('   Name:', response.data.data.teamMember.name);
      console.log('   Department:', response.data.data.teamMember.department);
      console.log('   Is Management:', response.data.data.teamMember.isManagement);
      console.log('   Avatar URL:', response.data.data.teamMember.avatarUrl || 'No avatar');
      return true;
    } else {
      console.log('❌ Create team member with optional fields failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Create team member with optional fields error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetAllTeamMembers() {
  try {
    console.log('\n📋 Testing get all team members...');
    const response = await axios.get(`${BASE_URL}/api/teams`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Team members retrieved successfully');
      console.log('   Total:', response.data.data.pagination.total);
      console.log('   Page:', response.data.data.pagination.page);
      console.log('   Page Size:', response.data.data.pagination.pageSize);
      console.log('   Teams count:', response.data.data.teams.length);
      return true;
    } else {
      console.log('❌ Get team members failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get team members error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetTeamMemberById() {
  try {
    console.log('\n🔍 Testing get team member by ID...');
    const response = await axios.get(`${BASE_URL}/api/teams/${createdTeamMemberId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Team member retrieved successfully');
      console.log('   Name:', response.data.data.teamMember.name);
      console.log('   Email:', response.data.data.teamMember.email);
      console.log('   Designation:', response.data.data.teamMember.designation);
      return true;
    } else {
      console.log('❌ Get team member by ID failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get team member by ID error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUpdateTeamMember() {
  try {
    console.log('\n✏️ Testing update team member...');
    
    const formData = new FormData();
    formData.append('name', updatedTeamMember.name);
    formData.append('designation', updatedTeamMember.designation);
    formData.append('isManagement', updatedTeamMember.isManagement.toString());
    formData.append('department', updatedTeamMember.department);
    formData.append('description', updatedTeamMember.description);

    const response = await axios.put(`${BASE_URL}/api/teams/${createdTeamMemberId}`, formData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        ...formData.getHeaders()
      }
    });

    if (response.data.success) {
      console.log('✅ Team member updated successfully');
      console.log('   Updated Name:', response.data.data.teamMember.name);
      console.log('   Updated Designation:', response.data.data.teamMember.designation);
      console.log('   Is Management:', response.data.data.teamMember.isManagement);
      console.log('   Department:', response.data.data.teamMember.department);
      return true;
    } else {
      console.log('❌ Update team member failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Update team member error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetTeamStats() {
  try {
    console.log('\n📊 Testing get team statistics...');
    const response = await axios.get(`${BASE_URL}/api/teams/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Team statistics retrieved successfully');
      console.log('   Total:', response.data.data.stats.total);
      console.log('   Active:', response.data.data.stats.active);
      console.log('   Management:', response.data.data.stats.management);
      console.log('   Departments:', response.data.data.stats.departments);
      return true;
    } else {
      console.log('❌ Get team stats failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get team stats error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetActiveTeamMembersPublic() {
  try {
    console.log('\n🌐 Testing get active team members (public)...');
    const response = await axios.get(`${BASE_URL}/api/teams/public/active`);

    if (response.data.success) {
      console.log('✅ Active team members retrieved successfully (public)');
      console.log('   Team members count:', response.data.data.teamMembers.length);
      if (response.data.data.teamMembers.length > 0) {
        console.log('   First member:', response.data.data.teamMembers[0].name);
        console.log('   First member designation:', response.data.data.teamMembers[0].designation);
      }
      return true;
    } else {
      console.log('❌ Get active team members (public) failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get active team members (public) error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testAvatarEndpoint() {
  try {
    console.log('\n🖼️ Testing avatar endpoint...');
    
    // First get a team member to check their avatar
    const teamResponse = await axios.get(`${BASE_URL}/api/teams/${createdTeamMemberId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (teamResponse.data.success && teamResponse.data.data.teamMember.avatar) {
      const avatarPath = teamResponse.data.data.teamMember.avatar;
      const filename = avatarPath.split('/').pop(); // Extract filename from path
      
      // Test avatar endpoint
      const avatarResponse = await axios.get(`${BASE_URL}/api/teams/avatar/${filename}`, {
        responseType: 'arraybuffer' // For binary data
      });

      if (avatarResponse.status === 200) {
        console.log('✅ Avatar endpoint working successfully');
        console.log('   Avatar URL:', `${BASE_URL}/api/teams/avatar/${filename}`);
        console.log('   Content-Type:', avatarResponse.headers['content-type']);
        console.log('   File size:', avatarResponse.data.length, 'bytes');
        return true;
      } else {
        console.log('❌ Avatar endpoint failed - unexpected status:', avatarResponse.status);
        return false;
      }
    } else {
      console.log('⚠️ No avatar found for team member, skipping avatar test');
      return true; // Not a failure, just no avatar to test
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('⚠️ Avatar not found (404) - this is expected if no avatar was uploaded');
      return true;
    } else {
      console.log('❌ Avatar endpoint error:', error.response?.data?.message || error.message);
      return false;
    }
  }
}

async function testPaginationAndFilters() {
  try {
    console.log('\n🔍 Testing pagination and filters...');
    
    // Test pagination
    const paginationResponse = await axios.get(`${BASE_URL}/api/teams?page=1&pageSize=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (paginationResponse.data.success) {
      console.log('✅ Pagination test successful');
      console.log('   Page:', paginationResponse.data.data.pagination.page);
      console.log('   Page Size:', paginationResponse.data.data.pagination.pageSize);
    }

    // Test status filter
    const statusResponse = await axios.get(`${BASE_URL}/api/teams?status=active`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (statusResponse.data.success) {
      console.log('✅ Status filter test successful');
      console.log('   Active members:', statusResponse.data.data.teams.length);
    }

    // Test management filter
    const managementResponse = await axios.get(`${BASE_URL}/api/teams?isManagement=true`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (managementResponse.data.success) {
      console.log('✅ Management filter test successful');
      console.log('   Management members:', managementResponse.data.data.teams.length);
    }

    // Test search
    const searchResponse = await axios.get(`${BASE_URL}/api/teams?search=John`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (searchResponse.data.success) {
      console.log('✅ Search test successful');
      console.log('   Search results:', searchResponse.data.data.teams.length);
    }

    return true;
  } catch (error) {
    console.log('❌ Pagination and filters test error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testValidation() {
  try {
    console.log('\n✅ Testing validation...');
    
    // Test missing required fields
    const formDataMissing = new FormData();
    formDataMissing.append('email', 'test@example.com');
    // Missing name and designation

    try {
      await axios.post(`${BASE_URL}/api/teams`, formDataMissing, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          ...formDataMissing.getHeaders()
        }
      });
      console.log('❌ Validation test failed - should have rejected missing required fields');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation test successful - rejected missing required fields');
      } else {
        console.log('❌ Validation test failed - unexpected error');
        return false;
      }
    }

    // Test invalid email format
    const formDataInvalidEmail = new FormData();
    formDataInvalidEmail.append('name', 'Test User');
    formDataInvalidEmail.append('email', 'invalid-email');
    formDataInvalidEmail.append('designation', 'Developer');

    try {
      await axios.post(`${BASE_URL}/api/teams`, formDataInvalidEmail, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          ...formDataInvalidEmail.getHeaders()
        }
      });
      console.log('❌ Email validation test failed - should have rejected invalid email');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Email validation test successful - rejected invalid email');
      } else {
        console.log('❌ Email validation test failed - unexpected error');
        return false;
      }
    }

    // Test that optional fields don't need validation
    const formDataOptional = new FormData();
    formDataOptional.append('name', 'Test User');
    formDataOptional.append('email', 'test@example.com');
    formDataOptional.append('designation', 'Developer');
    formDataOptional.append('phoneNumber', 'invalid-phone'); // This should not cause validation error
    formDataOptional.append('linkedinUrl', 'not-a-url'); // This should not cause validation error

    try {
      const response = await axios.post(`${BASE_URL}/api/teams`, formDataOptional, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          ...formDataOptional.getHeaders()
        }
      });
      if (response.data.success) {
        console.log('✅ Optional fields validation test successful - optional fields accepted without strict validation');
        // Clean up the created team member
        if (response.data.data.teamMember.id) {
          await axios.delete(`${BASE_URL}/api/teams/${response.data.data.teamMember.id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
        }
      } else {
        console.log('❌ Optional fields validation test failed - should have accepted optional fields');
        return false;
      }
    } catch (error) {
      console.log('❌ Optional fields validation test error:', error.response?.data?.message || error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Validation test error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDeleteTeamMember() {
  try {
    console.log('\n🗑️ Testing delete team member...');
    const response = await axios.delete(`${BASE_URL}/api/teams/${createdTeamMemberId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Team member deleted successfully');
      return true;
    } else {
      console.log('❌ Delete team member failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Delete team member error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUnauthorizedAccess() {
  try {
    console.log('\n🔒 Testing unauthorized access...');
    
    // Test without token
    try {
      await axios.get(`${BASE_URL}/api/teams`);
      console.log('❌ Unauthorized access test failed - should have been rejected');
      return false;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access test successful - rejected without token');
      } else {
        console.log('❌ Unauthorized access test failed - unexpected error');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log('❌ Unauthorized access test error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function cleanup() {
  try {
    console.log('\n🧹 Cleaning up test data...');
    
    if (createdTeamMemberId) {
      try {
        await axios.delete(`${BASE_URL}/api/teams/${createdTeamMemberId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Test data cleaned up');
      } catch (error) {
        console.log('⚠️ Cleanup warning:', error.response?.data?.message || error.message);
      }
    }
  } catch (error) {
    console.log('⚠️ Cleanup error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Team API Tests...\n');
  
  const tests = [
    { name: 'Admin Login', fn: loginAsAdmin },
    { name: 'Create Team Member (Required Fields)', fn: testCreateTeamMember },
    { name: 'Create Team Member (With Optional)', fn: testCreateTeamMemberWithOptional },
    { name: 'Get All Team Members', fn: testGetAllTeamMembers },
    { name: 'Get Team Member by ID', fn: testGetTeamMemberById },
    { name: 'Update Team Member', fn: testUpdateTeamMember },
    { name: 'Get Team Statistics', fn: testGetTeamStats },
    { name: 'Get Active Team Members (Public)', fn: testGetActiveTeamMembersPublic },
    { name: 'Avatar Endpoint', fn: testAvatarEndpoint },
    { name: 'Pagination and Filters', fn: testPaginationAndFilters },
    { name: 'Validation', fn: testValidation },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess },
    { name: 'Delete Team Member', fn: testDeleteTeamMember }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} failed with error:`, error.message);
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Team API is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
  }

  await cleanup();
}

async function checkServer() {
  try {
    console.log('🔍 Checking if server is running...');
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.success) {
      console.log('✅ Server is running');
      return true;
    } else {
      console.log('❌ Server health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('   Please start the server with: npm run dev');
    return false;
  }
}

async function main() {
  console.log('🧪 Team API Test Suite');
  console.log('======================\n');

  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }

  await runTests();
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Run the tests
main().catch(console.error);
