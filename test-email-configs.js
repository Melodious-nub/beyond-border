const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Common cPanel SMTP configurations to test
const emailConfigs = [
  {
    name: 'Standard cPanel (Port 587)',
    config: {
      host: 'mail.beyond-border.org',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@beyond-border.org',
        pass: 'H4=~$k]3-E$%L)m}'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'Standard cPanel (Port 465)',
    config: {
      host: 'mail.beyond-border.org',
      port: 465,
      secure: true,
      auth: {
        user: 'no-reply@beyond-border.org',
        pass: 'H4=~$k]3-E$%L)m}'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'Alternative cPanel (Port 25)',
    config: {
      host: 'mail.beyond-border.org',
      port: 25,
      secure: false,
      auth: {
        user: 'no-reply@beyond-border.org',
        pass: 'H4=~$k]3-E$%L)m}'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'Full email as username',
    config: {
      host: 'mail.beyond-border.org',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@beyond-border.org',
        pass: 'H4=~$k]3-E$%L)m}'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  }
];

async function testEmailConfig(config, name) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   User: ${config.auth.user}`);
  console.log(`   Secure: ${config.secure}`);
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    // Test connection
    await transporter.verify();
    console.log('   ✅ Connection successful!');
    
    // Try to send test email
    const info = await transporter.sendMail({
      from: `"Beyond Border" <${config.auth.user}>`,
      to: 'shawon.taluckder2@gmail.com',
      subject: 'Test Email from Beyond Border Backend',
      html: `
        <h2>Test Email Configuration</h2>
        <p>This is a test email to verify the email configuration.</p>
        <p><strong>Configuration:</strong> ${name}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('   ✅ Email sent successfully!');
    console.log(`   📧 Message ID: ${info.messageId}`);
    return { success: true, config, messageId: info.messageId };
    
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return { success: false, config, error: error.message };
  }
}

async function testAllConfigs() {
  console.log('🔍 Testing different cPanel email configurations...\n');
  
  const results = [];
  
  for (const emailConfig of emailConfigs) {
    const result = await testEmailConfig(emailConfig.config, emailConfig.name);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ Working configurations:');
    successful.forEach((result, index) => {
      console.log(`${index + 1}. ${result.config.host}:${result.config.port} (${result.config.secure ? 'SSL' : 'TLS'})`);
    });
    
    console.log('\n🎉 Use the first working configuration in your .env file!');
  } else {
    console.log('\n❌ No working configurations found.');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if the email account exists in cPanel');
    console.log('2. Verify the password is correct');
    console.log('3. Check if the email account is suspended');
    console.log('4. Try creating a new email account in cPanel');
    console.log('5. Check cPanel email settings and restrictions');
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed configurations:');
    failed.forEach((result, index) => {
      console.log(`${index + 1}. ${result.error}`);
    });
  }
}

testAllConfigs().catch(console.error);
