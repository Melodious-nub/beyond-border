const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testimonialData = {
  name: 'John Doe',
  department: 'Engineering',
  designation: 'Senior Developer',
  description: 'This company has provided excellent service and support throughout our project. The team is professional and responsive.'
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

async function testTestimonialAPIs() {
  console.log('\n📋 Testing Testimonial APIs...');
  
  try {
    // Test 1: Create Testimonial
    console.log('1. Creating Testimonial...');
    const createResponse = await axios.post(`${BASE_URL}/api/testimonials`, testimonialData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (createResponse.data.success) {
      console.log('✅ Testimonial created successfully');
      const testimonialId = createResponse.data.data.testimonial.id;
      
      // Test 2: Get all Testimonials (Admin)
      console.log('2. Getting all Testimonials (Admin)...');
      const getAllResponse = await axios.get(`${BASE_URL}/api/testimonials?page=1&pageSize=10`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (getAllResponse.data.success) {
        console.log('✅ Testimonials retrieved successfully (Admin)');
        console.log('Pagination:', getAllResponse.data.data.pagination);
      }
      
      // Test 3: Get Testimonial by ID
      console.log('3. Getting Testimonial by ID...');
      const getByIdResponse = await axios.get(`${BASE_URL}/api/testimonials/${testimonialId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (getByIdResponse.data.success) {
        console.log('✅ Testimonial retrieved by ID successfully');
      }
      
      // Test 4: Update Testimonial
      console.log('4. Updating Testimonial...');
      const updateData = {
        name: 'John Updated Doe',
        department: 'Updated Engineering',
        designation: 'Lead Developer',
        description: 'Updated testimonial: This company continues to provide excellent service and support throughout our project.'
      };
      
      const updateResponse = await axios.put(`${BASE_URL}/api/testimonials/${testimonialId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (updateResponse.data.success) {
        console.log('✅ Testimonial updated successfully');
      }
      
      // Test 5: Get all Testimonials (Public)
      console.log('5. Getting all Testimonials (Public)...');
      const getPublicResponse = await axios.get(`${BASE_URL}/api/testimonials/public/all`);
      
      if (getPublicResponse.data.success) {
        console.log('✅ Testimonials retrieved successfully (Public)');
        console.log('Total testimonials:', getPublicResponse.data.data.testimonials.length);
      }
      
      // Test 6: Delete Testimonial
      console.log('6. Deleting Testimonial...');
      const deleteResponse = await axios.delete(`${BASE_URL}/api/testimonials/${testimonialId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (deleteResponse.data.success) {
        console.log('✅ Testimonial deleted successfully');
      }
      
    }
  } catch (error) {
    console.log('❌ Testimonial API test failed:', error.response?.data?.message || error.message);
  }
}

async function testValidation() {
  console.log('\n📋 Testing Validation...');
  
  try {
    // Test testimonial validation (missing name)
    console.log('1. Testing Testimonial validation (missing name)...');
    const invalidTestimonial = {
      description: 'Description without name'
    };
    
    try {
      await axios.post(`${BASE_URL}/api/testimonials`, invalidTestimonial, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Testimonial validation working correctly');
      }
    }
    
    // Test testimonial validation (missing description)
    console.log('2. Testing Testimonial validation (missing description)...');
    const invalidTestimonial2 = {
      name: 'John Doe'
    };
    
    try {
      await axios.post(`${BASE_URL}/api/testimonials`, invalidTestimonial2, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Testimonial validation working correctly');
      }
    }
  } catch (error) {
    console.log('❌ Validation test failed:', error.response?.data?.message || error.message);
  }
}

async function testUnauthorizedAccess() {
  console.log('\n📋 Testing Unauthorized Access...');
  
  try {
    // Test Testimonials without token
    console.log('1. Testing Testimonials without token...');
    try {
      await axios.post(`${BASE_URL}/api/testimonials`, testimonialData);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Testimonials unauthorized access blocked correctly');
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
  console.log('🚀 Starting Testimonial API Tests...\n');
  
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
  await testTestimonialAPIs();
  await testValidation();
  await testUnauthorizedAccess();
  
  console.log('\n🎉 All testimonial tests completed!');
}

// Run the tests
main().catch(console.error);
