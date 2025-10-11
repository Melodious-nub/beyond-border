const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('🔍 Beyond Border Email Service Test');
console.log('===================================\n');

// Display current configuration
console.log('📧 Current Email Configuration:');
console.log('   EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('   EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('   EMAIL_SECURE:', process.env.EMAIL_SECURE);
console.log('   EMAIL_USER:', process.env.EMAIL_USER);
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '***hidden***' : 'NOT SET');
console.log('   EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME);
console.log('   NOTIFICATION_EMAILS:', process.env.NOTIFICATION_EMAILS);
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('');

async function testEmailService() {
  try {
    console.log('🧪 Testing email service configuration...\n');
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    console.log('🔌 Testing connection...');
    await transporter.verify();
    console.log('✅ Connection successful!');
    
    console.log('\n📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Beyond Border'}" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAILS || 'test@example.com',
      subject: 'Beyond Border Email Service Test',
      html: `
        <h2>✅ Email Service Test Successful</h2>
        <p>This is a test email to verify the email configuration is working correctly.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Host:</strong> ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}</p>
        <p><strong>Secure:</strong> ${process.env.EMAIL_SECURE === 'true' ? 'SSL' : 'TLS'}</p>
        <hr>
        <p><em>If you received this email, your email service is properly configured!</em></p>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📧 Response: ${info.response}`);
    
    console.log('\n🎉 Email service is working correctly!');
    console.log('\n📋 Next steps:');
    console.log('1. Check your email inbox (and spam folder)');
    console.log('2. Test the contact form on your website');
    console.log('3. Monitor the application logs for email notifications');
    
  } catch (error) {
    console.error('\n❌ Email service test failed!');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code || 'N/A');
    
    console.log('\n🔧 Troubleshooting steps:');
    if (error.message.includes('Authentication failed')) {
      console.log('1. Check your email username and password');
      console.log('2. Verify the email account exists in cPanel');
      console.log('3. Check if the email account is suspended');
    } else if (error.message.includes('Connection timeout')) {
      console.log('1. Check if the host and port are correct');
      console.log('2. Verify your hosting provider allows SMTP connections');
      console.log('3. Try different ports (587, 465, 25)');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('1. The server is not accepting connections on this port');
      console.log('2. Check firewall settings');
      console.log('3. Contact your hosting provider');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('1. The hostname could not be resolved');
      console.log('2. Check the EMAIL_HOST setting');
    }
    
    console.log('\n💡 Alternative solutions:');
    console.log('1. Try using Gmail SMTP instead');
    console.log('2. Use a different email service provider');
    console.log('3. Contact your hosting provider for SMTP settings');
    
    process.exit(1);
  }
}

// Run the test
testEmailService();
