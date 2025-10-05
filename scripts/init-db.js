const mysql = require('mysql2');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Create database connection without specifying database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Initialize database
const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    console.log(`📊 Connecting to MySQL server: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`👤 Using user: ${process.env.DB_USER || 'root'}`);
    
    // Test connection first
    await connection.promise().ping();
    console.log('✅ MySQL server connection successful');
    
    // Create database if it doesn't exist
    await connection.promise().query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    
    console.log(`✅ Database '${process.env.DB_NAME}' created/verified successfully`);
    
    // Switch to the database
    await connection.promise().query(`USE ${process.env.DB_NAME}`);
    
    // Create users table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'admin',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Users table created successfully');
    
    // Create a default admin user if no users exist
    const [rows] = await connection.promise().query('SELECT COUNT(*) as count FROM users');
    
    if (rows[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await connection.promise().query(
        'INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@example.com', hashedPassword, 'admin']
      );
      
      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the default password after first login!');
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check your .env file database credentials');
    console.log('3. For XAMPP: Start Apache + MySQL services');
    console.log('4. For standalone MySQL: Check username/password');
    console.log('5. See DATABASE_SETUP.md for detailed instructions');
    process.exit(1);
  } finally {
    connection.end();
  }
};

// Run initialization
initDatabase();
