const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let createdPageId = '';
let createdBreadcrumbId = '';

// Test data
const testPage = {
  page: 'test-page',
  pageTitle: 'Test Page Title',
  pageDescription: 'This is a test page description for testing the dynamic page management system.',
  bgColor: '#f0f8ff',
  isActive: true
};

const testBreadcrumb = {
  pageId: 1, // Will be updated after page creation
  page: 'test-page',
  pageTitle: 'Test Page Title',
  pageDescription: 'This is a test page description for testing the dynamic page management system.',
  bgColor: '#f0f8ff'
};

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    authToken = response.data.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testPageCreation() {
  try {
    console.log('\n📄 Testing page creation...');
    const response = await axios.post(`${BASE_URL}/api/pages`, testPage, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    createdPageId = response.data.data.page.id;
    testBreadcrumb.pageId = createdPageId;
    console.log('✅ Page created successfully:', response.data.data.page);
    return true;
  } catch (error) {
    console.error('❌ Page creation failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetAllPages() {
  try {
    console.log('\n📋 Testing get all pages...');
    const response = await axios.get(`${BASE_URL}/api/pages`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Pages retrieved successfully:', response.data.data.pages.length, 'pages found');
    return true;
  } catch (error) {
    console.error('❌ Get pages failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetActivePages() {
  try {
    console.log('\n📋 Testing get active pages...');
    const response = await axios.get(`${BASE_URL}/api/pages/active`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Active pages retrieved successfully:', response.data.data.pages.length, 'active pages found');
    return true;
  } catch (error) {
    console.error('❌ Get active pages failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetPageById() {
  try {
    console.log('\n🔍 Testing get page by ID...');
    const response = await axios.get(`${BASE_URL}/api/pages/${createdPageId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Page retrieved by ID successfully:', response.data.data.page.pageTitle);
    return true;
  } catch (error) {
    console.error('❌ Get page by ID failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetPageBySlug() {
  try {
    console.log('\n🔍 Testing get page by slug...');
    const response = await axios.get(`${BASE_URL}/api/pages/slug/${testPage.page}`);
    
    console.log('✅ Page retrieved by slug successfully:', response.data.data.page.pageTitle);
    return true;
  } catch (error) {
    console.error('❌ Get page by slug failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUpdatePage() {
  try {
    console.log('\n✏️ Testing page update...');
    const updateData = {
      pageTitle: 'Updated Test Page Title',
      pageDescription: 'This is an updated test page description.',
      bgColor: '#ffe4e1'
    };
    
    const response = await axios.put(`${BASE_URL}/api/pages/${createdPageId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Page updated successfully:', response.data.data.page.pageTitle);
    return true;
  } catch (error) {
    console.error('❌ Page update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testBreadcrumbCreation() {
  try {
    console.log('\n🍞 Testing breadcrumb creation...');
    const response = await axios.post(`${BASE_URL}/api/breadcrumbs`, testBreadcrumb, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    createdBreadcrumbId = response.data.data.breadcrumb.id;
    console.log('✅ Breadcrumb created successfully:', response.data.data.breadcrumb);
    return true;
  } catch (error) {
    console.error('❌ Breadcrumb creation failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetAllBreadcrumbs() {
  try {
    console.log('\n🍞 Testing get all breadcrumbs...');
    const response = await axios.get(`${BASE_URL}/api/breadcrumbs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Breadcrumbs retrieved successfully:', response.data.data.breadcrumbs.length, 'breadcrumbs found');
    return true;
  } catch (error) {
    console.error('❌ Get breadcrumbs failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetActiveBreadcrumbs() {
  try {
    console.log('\n🍞 Testing get active breadcrumbs...');
    const response = await axios.get(`${BASE_URL}/api/breadcrumbs/active`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Active breadcrumbs retrieved successfully:', response.data.data.breadcrumbs.length, 'active breadcrumbs found');
    return true;
  } catch (error) {
    console.error('❌ Get active breadcrumbs failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetPageData() {
  try {
    console.log('\n📊 Testing get page data for frontend...');
    const response = await axios.get(`${BASE_URL}/api/breadcrumbs/page-data`);
    
    console.log('✅ Page data retrieved successfully:', response.data.data.pageData.length, 'page data items found');
    console.log('📋 Sample page data:', response.data.data.pageData[0]);
    return true;
  } catch (error) {
    console.error('❌ Get page data failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetBreadcrumbByPageId() {
  try {
    console.log('\n🔍 Testing get breadcrumb by page ID...');
    const response = await axios.get(`${BASE_URL}/api/breadcrumbs/page/${createdPageId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Breadcrumb retrieved by page ID successfully:', response.data.data.breadcrumb.pageTitle);
    return true;
  } catch (error) {
    console.error('❌ Get breadcrumb by page ID failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetBreadcrumbBySlug() {
  try {
    console.log('\n🔍 Testing get breadcrumb by slug...');
    const response = await axios.get(`${BASE_URL}/api/breadcrumbs/slug/${testPage.page}`);
    
    console.log('✅ Breadcrumb retrieved by slug successfully:', response.data.data.breadcrumb.pageTitle);
    return true;
  } catch (error) {
    console.error('❌ Get breadcrumb by slug failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUpdateBreadcrumb() {
  try {
    console.log('\n✏️ Testing breadcrumb update...');
    const updateData = {
      pageTitle: 'Updated Test Page Title for Breadcrumb',
      pageDescription: 'This is an updated test page description for breadcrumb.',
      bgColor: '#ffe4e1'
    };
    
    const response = await axios.put(`${BASE_URL}/api/breadcrumbs/${createdBreadcrumbId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Breadcrumb updated successfully:', response.data.data.breadcrumb.pageTitle);
    return true;
  } catch (error) {
    console.error('❌ Breadcrumb update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testPageStats() {
  try {
    console.log('\n📊 Testing page statistics...');
    const response = await axios.get(`${BASE_URL}/api/pages/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Page statistics retrieved successfully:', response.data.data.stats);
    return true;
  } catch (error) {
    console.error('❌ Get page stats failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testBreadcrumbStats() {
  try {
    console.log('\n📊 Testing breadcrumb statistics...');
    const response = await axios.get(`${BASE_URL}/api/breadcrumbs/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Breadcrumb statistics retrieved successfully:', response.data.data.stats);
    return true;
  } catch (error) {
    console.error('❌ Get breadcrumb stats failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testBreadcrumbUpdate() {
  try {
    console.log('\n🔄 Testing breadcrumb update (createOrUpdate)...');
    const updateData = {
      pageId: createdPageId,
      page: testPage.page,
      pageTitle: 'Updated Breadcrumb Title',
      pageDescription: 'This is an updated breadcrumb description.',
      bgColor: '#e6f3ff'
    };
    
    const response = await axios.post(`${BASE_URL}/api/breadcrumbs`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Breadcrumb updated via createOrUpdate successfully:', response.data.data.breadcrumb.pageTitle);
    return true;
  } catch (error) {
    console.error('❌ Breadcrumb update via createOrUpdate failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDeleteBreadcrumb() {
  try {
    console.log('\n🗑️ Testing breadcrumb deletion...');
    const response = await axios.delete(`${BASE_URL}/api/breadcrumbs/${createdBreadcrumbId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Breadcrumb deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Breadcrumb deletion failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDeletePage() {
  try {
    console.log('\n🗑️ Testing page deletion (soft delete)...');
    const response = await axios.delete(`${BASE_URL}/api/pages/${createdPageId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Page deleted successfully (soft delete)');
    return true;
  } catch (error) {
    console.error('❌ Page deletion failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testRestorePage() {
  try {
    console.log('\n🔄 Testing page restoration...');
    const response = await axios.patch(`${BASE_URL}/api/pages/${createdPageId}/restore`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Page restored successfully');
    return true;
  } catch (error) {
    console.error('❌ Page restoration failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Page and Breadcrumb API Tests\n');
  
  const tests = [
    { name: 'Login', fn: login },
    { name: 'Page Creation', fn: testPageCreation },
    { name: 'Get All Pages', fn: testGetAllPages },
    { name: 'Get Active Pages', fn: testGetActivePages },
    { name: 'Get Page by ID', fn: testGetPageById },
    { name: 'Get Page by Slug', fn: testGetPageBySlug },
    { name: 'Update Page', fn: testUpdatePage },
    { name: 'Breadcrumb Creation', fn: testBreadcrumbCreation },
    { name: 'Get All Breadcrumbs', fn: testGetAllBreadcrumbs },
    { name: 'Get Active Breadcrumbs', fn: testGetActiveBreadcrumbs },
    { name: 'Get Page Data', fn: testGetPageData },
    { name: 'Get Breadcrumb by Page ID', fn: testGetBreadcrumbByPageId },
    { name: 'Get Breadcrumb by Slug', fn: testGetBreadcrumbBySlug },
    { name: 'Update Breadcrumb', fn: testUpdateBreadcrumb },
    { name: 'Breadcrumb Update (createOrUpdate)', fn: testBreadcrumbUpdate },
    { name: 'Page Statistics', fn: testPageStats },
    { name: 'Breadcrumb Statistics', fn: testBreadcrumbStats },
    { name: 'Delete Breadcrumb', fn: testDeleteBreadcrumb },
    { name: 'Delete Page (Soft)', fn: testDeletePage },
    { name: 'Restore Page', fn: testRestorePage }
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
      console.error(`❌ Test "${test.name}" failed with error:`, error.message);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! The Page and Breadcrumb API system is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
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
  console.log('🔍 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ Server is not running. Please start the server with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is running');
  await runTests();
}

main().catch(console.error);
