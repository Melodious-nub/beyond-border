const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data for consultant request
const testConsultantRequest = {
  ngoName: 'Green Earth Foundation',
  ngoRegistrationNumber: 'REG-2024-001',
  chairmanPresidentName: 'Dr. Sarah Johnson',
  specializedAreas: 'Environmental conservation, climate resilience, sustainable agriculture, renewable energy projects',
  planningToExpand: true,
  expansionRegions: 'East Africa, South Asia',
  needFundingSupport: true,
  totalFundRequired: 500000.00,
  lookingForFundManager: false,
  openToSplittingInvestment: true,
  hasSpecializedTeam: false,
  needAssistance: true,
  emailAddress: 'contact@greenearth.org',
  websiteAddress: 'https://www.greenearth.org',
  phoneNumber: '+1-555-0123'
};

let adminToken = '';
let createdConsultantId = '';

async function loginAsAdmin() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@beyondborder.com',
      password: 'admin123'
    });
    
    adminToken = response.data.data.token;
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testConsultantAPIs() {
  console.log('\n🤝 Testing Consultant APIs...');
  
  try {
    // 1. Create consultant request (Public)
    console.log('1. Creating consultant request (Public)...');
    const createResponse = await axios.post(`${BASE_URL}/consultants`, testConsultantRequest);
    createdConsultantId = createResponse.data.data.consultant.id;
    console.log('✅ Consultant request created:', createResponse.data.data.consultant.ngoName);

    // 2. Get all consultant requests (Admin with pagination)
    console.log('\n2. Getting all consultant requests (Admin with pagination)...');
    const getAllResponse = await axios.get(`${BASE_URL}/consultants?page=1&pageSize=10`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All consultant requests:', {
      total: getAllResponse.data.data.pagination.total,
      page: getAllResponse.data.data.pagination.page,
      consultants: getAllResponse.data.data.consultants.length
    });

    // 3. Get consultant request by ID (Admin)
    console.log('\n3. Getting consultant request by ID (Admin)...');
    const getByIdResponse = await axios.get(`${BASE_URL}/consultants/${createdConsultantId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Consultant request by ID:', getByIdResponse.data.data.consultant.ngoName);

    // 4. Update consultant request status (Admin)
    console.log('\n4. Updating consultant request status (Admin)...');
    const updateStatusResponse = await axios.put(`${BASE_URL}/consultants/${createdConsultantId}/status`, {
      status: 'read'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Consultant request status updated:', updateStatusResponse.data.data.consultant.status);

  } catch (error) {
    console.error('❌ Consultant API test failed:', error.response?.data?.message || error.message);
  }
}

async function testValidation() {
  console.log('\n🔍 Testing Validation...');
  
  try {
    // Test invalid consultant request
    console.log('1. Testing invalid consultant request...');
    const invalidRequest = {
      ngoName: '', // Empty name should fail
      chairmanPresidentName: 'Dr. Sarah Johnson',
      specializedAreas: 'Environmental conservation',
      planningToExpand: true,
      needFundingSupport: true,
      lookingForFundManager: false,
      openToSplittingInvestment: true,
      hasSpecializedTeam: false,
      emailAddress: 'invalid-email', // Invalid email should fail
      phoneNumber: '123' // Too short phone number should fail
    };
    
    await axios.post(`${BASE_URL}/consultants`, invalidRequest);
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Validation working correctly:', error.response.data.message);
    } else {
      console.error('❌ Validation test failed:', error.response?.data?.message || error.message);
    }
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up...');
  
  try {
    // Delete consultant request
    if (createdConsultantId) {
      await axios.delete(`${BASE_URL}/consultants/${createdConsultantId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Consultant request deleted');
    }
  } catch (error) {
    console.error('❌ Cleanup failed:', error.response?.data?.message || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Consultant API Tests...\n');
  
  const loginSuccess = await loginAsAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin login');
    return;
  }

  await testConsultantAPIs();
  await testValidation();
  await cleanup();
  
  console.log('\n✅ All consultant tests completed!');
}

// Run tests
runTests().catch(console.error);
