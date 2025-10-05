#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Beyond Border Backend...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with your database configuration.');
  console.log('See README.md for details.\n');
  process.exit(1);
}

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');

  // Initialize database
  console.log('🗄️  Initializing database...');
  execSync('npm run init-db', { stdio: 'inherit' });
  console.log('✅ Database initialized successfully\n');

  console.log('🎉 Setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your .env file with correct database credentials');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Test the API endpoints using the examples in README.md');
  console.log('4. View the interactive API documentation at http://localhost:3000/api-docs');
  console.log('\n🔗 Default admin credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
  console.log('⚠️  Please change the default password after first login!');
  console.log('\n📚 API Documentation:');
  console.log('- Swagger UI: http://localhost:3000/api-docs');
  console.log('- Root redirect: http://localhost:3000');
  console.log('- Test Swagger: npm run test-swagger\n');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
