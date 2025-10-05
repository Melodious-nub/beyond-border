# Quick Start Guide

## 🚀 Get Your Backend Running in 5 Minutes

### Step 1: Install MySQL (Choose One)

#### Option A: XAMPP (Easiest for Windows)
1. Download XAMPP: https://www.apachefriends.org/
2. Install and start **Apache** + **MySQL** services
3. Open http://localhost/phpmyadmin
4. Create database: `beyond_border_db`

#### Option B: MySQL Server
1. Download MySQL: https://dev.mysql.com/downloads/mysql/
2. Install with default settings
3. Remember your root password

### Step 2: Configure Database

Edit your `.env` file:

**For XAMPP (no password):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beyond_border_db
DB_PORT=3306
```

**For MySQL Server (with password):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=beyond_border_db
DB_PORT=3306
```

### Step 3: Test & Setup

```bash
# Test database connection
npm run test-db

# Initialize database (if connection works)
npm run init-db

# Start the application
npm run dev
```

### Step 4: Access Your API

- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **Default Admin**: admin@example.com / admin123

## 🔧 Troubleshooting

### "Access denied for user"
- **XAMPP**: Make sure MySQL service is running, use empty password
- **MySQL Server**: Check your root password in .env file

### "Can't connect to MySQL server"
- Start MySQL service (XAMPP control panel or Windows services)
- Check if port 3306 is available

### "Unknown database"
- Run: `npm run init-db`

## 📚 Available Commands

```bash
npm run test-db      # Test database connection
npm run init-db      # Initialize database
npm run dev          # Start development server
npm run test         # Test API endpoints
npm run test-swagger # Test Swagger documentation
```

## 🎯 What's Next?

1. **Test the API**: Use the Swagger UI at http://localhost:3000/api-docs
2. **Create users**: Register new users via the API
3. **Build frontend**: Connect your frontend to these APIs
4. **Deploy**: Update .env for production and deploy

## 📖 Full Documentation

- **README.md**: Complete setup and API documentation
- **DATABASE_SETUP.md**: Detailed database setup guide
- **Swagger UI**: Interactive API documentation at /api-docs
