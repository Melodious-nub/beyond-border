const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123',
  role: 'admin'
};

async function testAPI() {
  console.log('🧪 Testing Beyond Border Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('👤 User ID:', registerResponse.data.data.user.id);

    // Test login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    const token = loginResponse.data.data.token;
    console.log('🔑 Token received');

    // Test protected route (me)
    console.log('\n4. Testing protected route (me)...');
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', meResponse.data.data.user.fullName);

    // Test profile update
    console.log('\n5. Testing profile update...');
    const updateResponse = await axios.put(`${BASE_URL}/api/auth/profile`, {
      fullName: 'Updated Test User'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile updated:', updateResponse.data.data.user.fullName);

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📋 API Summary:');
    console.log('- Health check: ✅');
    console.log('- User registration: ✅');
    console.log('- User login: ✅');
    console.log('- Protected routes: ✅');
    console.log('- Profile update: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running!');
    console.log('Please start the server first:');
    console.log('npm run dev');
    process.exit(1);
  }

  await testAPI();
}

main();
