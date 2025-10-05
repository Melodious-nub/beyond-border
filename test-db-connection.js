const mysql = require('mysql2');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  // Display current configuration
  console.log('📋 Current Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || '3306'}`);
  console.log(`   User: ${process.env.DB_USER || 'root'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(empty)'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'beyond_border_db'}`);
  console.log('');

  // Test connection without database first
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  try {
    console.log('1. Testing MySQL server connection...');
    await connection.promise().ping();
    console.log('✅ MySQL server is running and accessible');

    console.log('\n2. Testing database access...');
    const [rows] = await connection.promise().execute('SHOW DATABASES');
    console.log('✅ Can list databases');
    
    const dbExists = rows.some(row => row.Database === process.env.DB_NAME);
    if (dbExists) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists`);
    } else {
      console.log(`⚠️  Database '${process.env.DB_NAME}' does not exist`);
      console.log('   Run: npm run init-db');
    }

    console.log('\n🎉 Database connection test successful!');
    console.log('\n📋 Next steps:');
    console.log('1. If database doesn\'t exist: npm run init-db');
    console.log('2. Start the application: npm run dev');
    console.log('3. Test API: npm test');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('- MySQL server is not running');
      console.log('- Start MySQL service (XAMPP, WAMP, or MySQL service)');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('- Wrong username or password');
      console.log('- Check your .env file credentials');
      console.log('- For XAMPP, try empty password');
    } else if (error.code === 'ENOTFOUND') {
      console.log('- Cannot resolve hostname');
      console.log('- Check DB_HOST in .env file');
    } else {
      console.log('- Check MySQL server status');
      console.log('- Verify .env file configuration');
      console.log('- See DATABASE_SETUP.md for detailed instructions');
    }
    
    process.exit(1);
  } finally {
    connection.end();
  }
}

testDatabaseConnection();
