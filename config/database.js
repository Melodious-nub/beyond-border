const mysql = require('mysql2');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database and create tables
const initializeDatabase = async () => {
  try {
    // Create users table
    await promisePool.execute(`
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

        // Create contacts table
        await promisePool.execute(`
          CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        // Create notification_emails table
        await promisePool.execute(`
          CREATE TABLE IF NOT EXISTS notification_emails (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

      // Create pages table
      await promisePool.execute(`
        CREATE TABLE IF NOT EXISTS pages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          page VARCHAR(100) UNIQUE NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_page (page)
        )
      `);

        // Create breadcrumbs table
        await promisePool.execute(`
          CREATE TABLE IF NOT EXISTS breadcrumbs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            page VARCHAR(100) UNIQUE NOT NULL,
            pageTitle VARCHAR(200) NOT NULL,
            pageDescription TEXT NOT NULL,
            bgColor VARCHAR(7) DEFAULT '#ffffff',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_page (page)
          )
        `);

        // Create consultants table
        await promisePool.execute(`
          CREATE TABLE IF NOT EXISTS consultants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ngoName VARCHAR(255) NOT NULL,
            ngoRegistrationNumber VARCHAR(100),
            chairmanPresidentName VARCHAR(255) NOT NULL,
            specializedAreas TEXT NOT NULL,
            planningToExpand BOOLEAN DEFAULT FALSE,
            expansionRegions TEXT,
            needFundingSupport BOOLEAN DEFAULT FALSE,
            totalFundRequired DECIMAL(15,2),
            lookingForFundManager BOOLEAN DEFAULT FALSE,
            openToSplittingInvestment BOOLEAN DEFAULT FALSE,
            hasSpecializedTeam BOOLEAN DEFAULT FALSE,
            needAssistance BOOLEAN,
            emailAddress VARCHAR(255) NOT NULL,
            websiteAddress VARCHAR(255),
            phoneNumber VARCHAR(50) NOT NULL,
            status ENUM('new', 'read', 'contacted', 'closed') DEFAULT 'new',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_createdAt (createdAt),
            INDEX idx_email (emailAddress)
          )
        `);

        // Create teams table
        await promisePool.execute(`
          CREATE TABLE IF NOT EXISTS teams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            avatar VARCHAR(500),
            designation VARCHAR(100) NOT NULL,
            status ENUM('active', 'inactive') DEFAULT 'active',
            isManagement BOOLEAN DEFAULT FALSE,
            phoneNumber VARCHAR(50),
            department VARCHAR(100),
            linkedinUrl VARCHAR(500),
            facebookUrl VARCHAR(500),
            twitterUrl VARCHAR(500),
            instagramUrl VARCHAR(500),
            redditUrl VARCHAR(500),
            description TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_isManagement (isManagement),
            INDEX idx_department (department),
            INDEX idx_email (email),
            INDEX idx_createdAt (createdAt)
          )
        `);

        // Create consultant_community table
        await promisePool.execute(`
          CREATE TABLE IF NOT EXISTS consultant_community (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            emailAddress VARCHAR(255) NOT NULL,
            phoneNumber VARCHAR(20) NOT NULL,
            linkedInProfile VARCHAR(500),
            company VARCHAR(100) NOT NULL,
            designation VARCHAR(100) NOT NULL,
            yearsOfExperience INT NOT NULL,
            areasOfExpertise JSON NOT NULL,
            whyJoinCommunity TEXT NOT NULL,
            howCanContribute TEXT NOT NULL,
            email BOOLEAN NOT NULL,
            whatsapp BOOLEAN NOT NULL,
            slack BOOLEAN NOT NULL,
            openToMentoring BOOLEAN NOT NULL,
            agreement BOOLEAN NOT NULL,
            status ENUM('new', 'reviewed', 'approved', 'rejected') DEFAULT 'new',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_emailAddress (emailAddress),
            INDEX idx_createdAt (createdAt),
            INDEX idx_company (company),
            INDEX idx_designation (designation)
          )
        `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
  initializeDatabase
};
