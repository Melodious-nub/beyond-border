# Database Setup Guide

## Quick Setup for Development

### Option 1: Using XAMPP/WAMP (Recommended for Windows)

1. **Install XAMPP**:
   - Download from: https://www.apachefriends.org/
   - Install and start Apache + MySQL services

2. **Access phpMyAdmin**:
   - Go to: http://localhost/phpmyadmin
   - Create a new database named `beyond_border_db`

3. **Update .env file**:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=beyond_border_db
   DB_PORT=3306
   ```

### Option 2: Using MySQL Server

1. **Install MySQL Server**:
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Install with default settings

2. **Create database**:
   ```sql
   CREATE DATABASE beyond_border_db;
   ```

3. **Update .env file**:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=beyond_border_db
   DB_PORT=3306
   ```

### Option 3: Using Docker (Advanced)

1. **Run MySQL container**:
   ```bash
   docker run --name mysql-beyond-border \
     -e MYSQL_ROOT_PASSWORD=password \
     -e MYSQL_DATABASE=beyond_border_db \
     -p 3306:3306 \
     -d mysql:8.0
   ```

2. **Update .env file**:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=beyond_border_db
   DB_PORT=3306
   ```

## Troubleshooting

### Common Issues

1. **"Access denied for user"**:
   - Check if MySQL is running
   - Verify username and password in .env
   - For XAMPP, usually no password needed (empty password)

2. **"Can't connect to MySQL server"**:
   - Make sure MySQL service is running
   - Check if port 3306 is available
   - Verify host and port in .env

3. **"Unknown database"**:
   - Create the database first
   - Run: `npm run init-db`

### Testing Connection

1. **Test database connection**:
   ```bash
   npm run init-db
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```

3. **Check health endpoint**:
   ```bash
   curl http://localhost:3000/health
   ```

## Default Credentials

After successful setup, you can use these default credentials:
- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!
