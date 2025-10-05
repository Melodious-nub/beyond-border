-- MySQL Setup Script for Beyond Border Backend
-- Run this script with: mysql -u root -p < setup-mysql.sql

-- Create database
CREATE DATABASE IF NOT EXISTS db;

-- Create user
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'root';

-- Grant privileges
GRANT ALL PRIVILEGES ON db.* TO 'admin'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Show results
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'admin';

-- Success message
SELECT 'MySQL setup completed successfully!' as Status;
