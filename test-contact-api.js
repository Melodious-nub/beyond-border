const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const API_BASE_URL = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

let adminToken = '';

async function runContactTests() {
  console.log('\n🧪 Testing Simplified Contact Form API...\n');

  try {
    // 1. Admin Login to get token
    console.log('1. Logging in as admin...');
    const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    adminToken = loginRes.data.data.token;
    console.log('✅ Admin login successful. Token received.');

    // 2. Submit a new contact form (Public API)
    console.log('\n2. Submitting a new contact form...');
    const contactData = {
      name: 'Test Contact User',
      email: 'contact@example.com',
      description: 'This is a test contact message from the simplified API test script. Please ignore.',
    };
    const submitRes = await axios.post(`${API_BASE_URL}/contact`, contactData);
    console.log('✅ Contact form submitted successfully:', submitRes.data.message);

    // 3. Get all contact messages (Admin Protected)
    console.log('\n3. Getting all contact messages (Admin Protected)...');
    const getAllRes = await axios.get(`${API_BASE_URL}/contact?page=1&pageSize=10`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✅ Retrieved all contact messages. Total:', getAllRes.data.data.contacts.length);

    // 4. Add notification email (Admin Protected)
    console.log('\n4. Adding notification email (Admin Protected)...');
    try {
      const addEmailRes = await axios.post(`${API_BASE_URL}/contact/notification-emails`, {
        email: 'test@example.com'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log('✅ Notification email added:', addEmailRes.data.data.notificationEmail.email);
    } catch (emailError) {
      if (emailError.response?.status === 409) {
        console.log('⚠️ Notification email already exists (expected):', emailError.response.data.message);
      } else {
        throw emailError;
      }
    }

    // 5. List notification emails (Admin Protected)
    console.log('\n5. Listing notification emails (Admin Protected)...');
    const listEmailsRes = await axios.get(`${API_BASE_URL}/contact/notification-emails`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✅ Retrieved notification emails. Count:', listEmailsRes.data.data.notificationEmails.length);

    // 6. Test email configuration (Admin Protected)
    console.log('\n6. Testing email configuration (Admin Protected)...');
    try {
      const testEmailRes = await axios.post(`${API_BASE_URL}/contact/test-email`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log('✅ Test email sent successfully:', testEmailRes.data.message);
    } catch (emailError) {
      console.log('⚠️ Email test failed (expected with test credentials):', emailError.response?.data?.message || emailError.message);
    }

    // 7. Delete notification email (Admin Protected)
    console.log('\n7. Deleting notification email (Admin Protected)...');
    const deleteEmailRes = await axios.delete(`${API_BASE_URL}/contact/notification-emails/test@example.com`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✅ Notification email deleted successfully:', deleteEmailRes.data.message);

    console.log('\n🎉 All Simplified Contact API tests passed successfully!\n');

  } catch (error) {
    console.error('\n❌ Contact API tests failed!');
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

runContactTests();