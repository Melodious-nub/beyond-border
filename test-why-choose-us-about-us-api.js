const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const whyChooseUsData = {
  title: 'Expert Team',
  details: 'Our team consists of experienced professionals with years of expertise in their respective fields.'
};

const aboutUsData = {
  description: 'Beyond Border Consultants is a multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services.'
};

let adminToken = '';

async function loginAsAdmin() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });

    if (response.data.success) {
      adminToken = response.data.data.token;
      console.log('✅ Admin login successful');
      return true;
    }
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testWhyChooseUsAPIs() {
  console.log('\n📋 Testing Why Choose Us APIs...');
  
  try {
    // Test 1: Create Why Choose Us item
    console.log('1. Creating Why Choose Us item...');
    const createResponse = await axios.post(`${BASE_URL}/api/why-choose-us`, whyChooseUsData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (createResponse.data.success) {
      console.log('✅ Why Choose Us item created successfully');
      const itemId = createResponse.data.data.whyChooseUs.id;
      
      // Test 2: Get all Why Choose Us items (Admin)
      console.log('2. Getting all Why Choose Us items (Admin)...');
      const getAllResponse = await axios.get(`${BASE_URL}/api/why-choose-us?page=1&pageSize=10`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (getAllResponse.data.success) {
        console.log('✅ Why Choose Us items retrieved successfully (Admin)');
      }
      
      // Test 3: Get Why Choose Us item by ID
      console.log('3. Getting Why Choose Us item by ID...');
      const getByIdResponse = await axios.get(`${BASE_URL}/api/why-choose-us/${itemId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (getByIdResponse.data.success) {
        console.log('✅ Why Choose Us item retrieved by ID successfully');
      }
      
      // Test 4: Update Why Choose Us item
      console.log('4. Updating Why Choose Us item...');
      const updateData = {
        title: 'Updated Expert Team',
        details: 'Updated details about our expert team with enhanced capabilities.'
      };
      
      const updateResponse = await axios.put(`${BASE_URL}/api/why-choose-us/${itemId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (updateResponse.data.success) {
        console.log('✅ Why Choose Us item updated successfully');
      }
      
      // Test 5: Get all Why Choose Us items (Public)
      console.log('5. Getting all Why Choose Us items (Public)...');
      const getPublicResponse = await axios.get(`${BASE_URL}/api/why-choose-us/public/all`);
      
      if (getPublicResponse.data.success) {
        console.log('✅ Why Choose Us items retrieved successfully (Public)');
      }
      
      // Test 6: Delete Why Choose Us item
      console.log('6. Deleting Why Choose Us item...');
      const deleteResponse = await axios.delete(`${BASE_URL}/api/why-choose-us/${itemId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (deleteResponse.data.success) {
        console.log('✅ Why Choose Us item deleted successfully');
      }
      
    }
  } catch (error) {
    console.log('❌ Why Choose Us API test failed:', error.response?.data?.message || error.message);
  }
}

async function testAboutUsAPIs() {
  console.log('\n📋 Testing About Us APIs...');
  
  try {
    // Test 1: Create/Update About Us
    console.log('1. Creating/Updating About Us...');
    const createResponse = await axios.post(`${BASE_URL}/api/about-us`, aboutUsData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (createResponse.data.success) {
      console.log('✅ About Us created/updated successfully');
      
      // Test 2: Get About Us (Admin)
      console.log('2. Getting About Us (Admin)...');
      const getAdminResponse = await axios.get(`${BASE_URL}/api/about-us`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (getAdminResponse.data.success) {
        console.log('✅ About Us retrieved successfully (Admin)');
      }
      
      // Test 3: Get About Us (Public)
      console.log('3. Getting About Us (Public)...');
      const getPublicResponse = await axios.get(`${BASE_URL}/api/about-us/public`);
      
      if (getPublicResponse.data.success) {
        console.log('✅ About Us retrieved successfully (Public)');
      }
      
      // Test 4: Update About Us again
      console.log('4. Updating About Us again...');
      const updateData = {
        description: 'Updated: Beyond Border Consultants is a leading multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services and innovative solutions.'
      };
      
      const updateResponse = await axios.post(`${BASE_URL}/api/about-us`, updateData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (updateResponse.data.success) {
        console.log('✅ About Us updated successfully');
      }
    }
  } catch (error) {
    console.log('❌ About Us API test failed:', error.response?.data?.message || error.message);
  }
}

async function testValidation() {
  console.log('\n📋 Testing Validation...');
  
  try {
    // Test Why Choose Us validation
    console.log('1. Testing Why Choose Us validation (missing title)...');
    const invalidWhyChooseUs = {
      details: 'Details without title'
    };
    
    try {
      await axios.post(`${BASE_URL}/api/why-choose-us`, invalidWhyChooseUs, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Why Choose Us validation working correctly');
      }
    }
    
    // Test About Us validation
    console.log('2. Testing About Us validation (missing description)...');
    const invalidAboutUs = {};
    
    try {
      await axios.post(`${BASE_URL}/api/about-us`, invalidAboutUs, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ About Us validation working correctly');
      }
    }
  } catch (error) {
    console.log('❌ Validation test failed:', error.response?.data?.message || error.message);
  }
}

async function testUnauthorizedAccess() {
  console.log('\n📋 Testing Unauthorized Access...');
  
  try {
    // Test Why Choose Us without token
    console.log('1. Testing Why Choose Us without token...');
    try {
      await axios.post(`${BASE_URL}/api/why-choose-us`, whyChooseUsData);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Why Choose Us unauthorized access blocked correctly');
      }
    }
    
    // Test About Us without token
    console.log('2. Testing About Us without token...');
    try {
      await axios.post(`${BASE_URL}/api/about-us`, aboutUsData);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ About Us unauthorized access blocked correctly');
      }
    }
  } catch (error) {
    console.log('❌ Unauthorized access test failed:', error.response?.data?.message || error.message);
  }
}

async function checkServer() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.success) {
      console.log('✅ Server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first.');
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Why Choose Us & About Us API Tests...\n');
  
  // Check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    return;
  }
  
  // Login as admin
  const loginSuccess = await loginAsAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin login');
    return;
  }
  
  // Run tests
  await testWhyChooseUsAPIs();
  await testAboutUsAPIs();
  await testValidation();
  await testUnauthorizedAccess();
  
  console.log('\n🎉 All tests completed!');
}

// Run the tests
main().catch(console.error);
