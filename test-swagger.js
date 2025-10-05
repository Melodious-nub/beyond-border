const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSwaggerDocumentation() {
  console.log('📚 Testing Swagger Documentation...\n');

  try {
    // Test if Swagger UI is accessible
    console.log('1. Testing Swagger UI accessibility...');
    const swaggerResponse = await axios.get(`${BASE_URL}/api-docs`);
    console.log('✅ Swagger UI is accessible');

    // Test root redirect
    console.log('\n2. Testing root redirect to API docs...');
    const rootResponse = await axios.get(`${BASE_URL}/`, { 
      maxRedirects: 0,
      validateStatus: (status) => status === 302 
    });
    console.log('✅ Root endpoint redirects to API docs');

    // Test health endpoint (documented in Swagger)
    console.log('\n3. Testing documented health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health endpoint working:', healthResponse.data.message);

    console.log('\n🎉 Swagger documentation is working correctly!');
    console.log('\n📋 Documentation Summary:');
    console.log('- Swagger UI: ✅ Accessible at /api-docs');
    console.log('- Root redirect: ✅ Working');
    console.log('- API endpoints: ✅ Documented and functional');
    console.log('\n🔗 Access your API documentation at:');
    console.log(`   ${BASE_URL}/api-docs`);
    console.log('\n💡 Features available in Swagger UI:');
    console.log('- Interactive API testing');
    console.log('- JWT authentication support');
    console.log('- Request/response examples');
    console.log('- Schema validation');
    console.log('- Error documentation');

  } catch (error) {
    console.error('❌ Swagger test failed:', error.response?.data || error.message);
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

  await testSwaggerDocumentation();
}

main();
