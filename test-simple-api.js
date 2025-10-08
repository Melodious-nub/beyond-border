const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testPage = {
  page: 'about'
};

const testBreadcrumb = {
  page: 'about',
  pageTitle: 'About Beyond Border Consultants',
  pageDescription: 'Beyond Border Consultants is a multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services.',
  bgColor: '#ffffff'
};

let adminToken = '';
let createdPageId = '';
let createdBreadcrumbId = '';

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

async function testPageAPIs() {
  console.log('\n📄 Testing Page APIs...');
  
  try {
    // 1. Create page
    console.log('1. Creating page...');
    const createResponse = await axios.post(`${BASE_URL}/pages`, testPage, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    createdPageId = createResponse.data.data.page.id;
    console.log('✅ Page created:', createResponse.data.data.page);

    // 2. Get all pages
    console.log('\n2. Getting all pages...');
    const getAllResponse = await axios.get(`${BASE_URL}/pages`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All pages:', getAllResponse.data.data.pages);

    // 3. Get page by ID
    console.log('\n3. Getting page by ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/pages/${createdPageId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Page by ID:', getByIdResponse.data.data.page);

    // 4. Get page by name (public)
    console.log('\n4. Getting page by name (public)...');
    const getByNameResponse = await axios.get(`${BASE_URL}/pages/name/${testPage.page}`);
    console.log('✅ Page by name:', getByNameResponse.data.data.page);

    // 5. Update page
    console.log('\n5. Updating page...');
    const updateResponse = await axios.put(`${BASE_URL}/pages/${createdPageId}`, {
      page: 'about-updated'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Page updated:', updateResponse.data.data.page);

  } catch (error) {
    console.error('❌ Page API test failed:', error.response?.data?.message || error.message);
  }
}

async function testBreadcrumbAPIs() {
  console.log('\n🍞 Testing Breadcrumb APIs...');
  
  try {
    // 1. Create breadcrumb
    console.log('1. Creating breadcrumb...');
    const createResponse = await axios.post(`${BASE_URL}/breadcrumbs`, testBreadcrumb, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    createdBreadcrumbId = createResponse.data.data.breadcrumb.id;
    console.log('✅ Breadcrumb created:', createResponse.data.data.breadcrumb);

    // 2. Get all breadcrumbs
    console.log('\n2. Getting all breadcrumbs...');
    const getAllResponse = await axios.get(`${BASE_URL}/breadcrumbs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All breadcrumbs:', getAllResponse.data.data.breadcrumbs);

    // 3. Get breadcrumb by ID
    console.log('\n3. Getting breadcrumb by ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/breadcrumbs/${createdBreadcrumbId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Breadcrumb by ID:', getByIdResponse.data.data.breadcrumb);

    // 4. Get breadcrumb by page name (public)
    console.log('\n4. Getting breadcrumb by page name (public)...');
    const getByPageResponse = await axios.get(`${BASE_URL}/breadcrumbs/page/${testBreadcrumb.page}`);
    console.log('✅ Breadcrumb by page:', getByPageResponse.data.data.breadcrumb);

    // 5. Update breadcrumb
    console.log('\n5. Updating breadcrumb...');
    const updateResponse = await axios.put(`${BASE_URL}/breadcrumbs/${createdBreadcrumbId}`, {
      pageTitle: 'About Beyond Border Consultants - Updated',
      pageDescription: 'Updated description for Beyond Border Consultants...',
      bgColor: '#f8f9fa'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Breadcrumb updated:', updateResponse.data.data.breadcrumb);

  } catch (error) {
    console.error('❌ Breadcrumb API test failed:', error.response?.data?.message || error.message);
  }
}

async function testValidation() {
  console.log('\n🔍 Testing Validation...');
  
  try {
    // Test duplicate page creation
    console.log('1. Testing duplicate page creation...');
    await axios.post(`${BASE_URL}/pages`, testPage, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('✅ Duplicate page validation working:', error.response.data.message);
    } else {
      console.error('❌ Validation test failed:', error.response?.data?.message || error.message);
    }
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up...');
  
  try {
    // Delete breadcrumb
    if (createdBreadcrumbId) {
      await axios.delete(`${BASE_URL}/breadcrumbs/${createdBreadcrumbId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Breadcrumb deleted');
    }

    // Delete page
    if (createdPageId) {
      await axios.delete(`${BASE_URL}/pages/${createdPageId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Page deleted');
    }
  } catch (error) {
    console.error('❌ Cleanup failed:', error.response?.data?.message || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Simple API Tests...\n');
  
  const loginSuccess = await loginAsAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin login');
    return;
  }

  await testPageAPIs();
  await testBreadcrumbAPIs();
  await testValidation();
  await cleanup();
  
  console.log('\n✅ All tests completed!');
}

// Run tests
runTests().catch(console.error);
