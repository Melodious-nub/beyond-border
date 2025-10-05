# PC Migration Guide - Beyond Border Backend

This guide helps you set up your Beyond Border Backend on a new PC with identical configuration.

## 🎯 **What You Need to Replicate**

Your current setup:
- **Database**: `db`
- **Username**: `admin`
- **Password**: `root`
- **Host**: `localhost`
- **Port**: `3306`

## 📦 **Step 1: Transfer Your Project**

### Option A: Git Repository (Recommended)
```bash
# On new PC
git clone <your-repository-url>
cd beyond-border-backend
```

### Option B: Copy Files
1. **Copy entire project folder** to new PC
2. **Ensure all files are included**:
   - All source code files
   - `package.json`
   - `.env` file
   - `node_modules` (or reinstall)

## 🗄️ **Step 2: Install MySQL Server**

### Download and Install
1. **Download MySQL Server**: https://dev.mysql.com/downloads/mysql/
2. **Install with default settings**
3. **Remember your root password** during installation

### Quick Setup (Using Provided Scripts)
1. **Copy these files** to your new PC:
   - `setup-mysql.sql`
   - `setup-mysql.bat`
   - `MYSQL_SETUP_GUIDE.md`

2. **Run the setup**:
   ```bash
   # Double-click setup-mysql.bat
   # OR run manually:
   mysql -u root -p < setup-mysql.sql
   ```

## 🔧 **Step 3: Set Up Your Backend**

### Install Dependencies
```bash
cd beyond-border-backend
npm install
```

### Test Database Connection
```bash
npm run test-db
```

### Initialize Database
```bash
npm run init-db
```

### Start the Application
```bash
npm run dev
```

## ✅ **Step 4: Verify Everything Works**

### Test All Components
```bash
# Test database connection
npm run test-db

# Test API endpoints
npm test

# Test Swagger documentation
npm run test-swagger
```

### Access Your Application
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **Default Admin**: admin@example.com / admin123

## 📋 **Complete Checklist**

### Before Migration
- [ ] Backup your current project
- [ ] Note down any custom configurations
- [ ] Save your .env file

### On New PC
- [ ] Install Node.js (v14 or higher)
- [ ] Install MySQL Server
- [ ] Copy project files
- [ ] Run MySQL setup script
- [ ] Install npm dependencies
- [ ] Test database connection
- [ ] Initialize database
- [ ] Start application
- [ ] Test all endpoints

## 🚨 **Troubleshooting**

### Common Issues

#### "Access denied for user 'admin'@'localhost'"
```sql
-- Run this in MySQL:
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

#### "Can't connect to MySQL server"
- Check if MySQL service is running
- Verify port 3306 is not blocked
- Check Windows Firewall settings

#### "Unknown database 'db'"
```sql
-- Run this in MySQL:
CREATE DATABASE db;
```

#### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🔄 **For Multiple PCs**

To maintain consistency across multiple PCs:

1. **Use Git** for version control
2. **Keep .env file** in your repository (or use .env.example)
3. **Document any custom changes**
4. **Use the same MySQL setup** on all PCs
5. **Test on each PC** after setup

## 📁 **Files to Transfer**

### Essential Files
- `package.json`
- `.env`
- All source code files
- `README.md`
- `MYSQL_SETUP_GUIDE.md`

### Optional Files
- `node_modules` (can be reinstalled)
- `test-*.js` files
- Documentation files

## 🎯 **Quick Migration Commands**

```bash
# 1. Install MySQL and run setup
mysql -u root -p < setup-mysql.sql

# 2. Install dependencies
npm install

# 3. Test and initialize
npm run test-db
npm run init-db

# 4. Start application
npm run dev
```

## 💡 **Pro Tips**

1. **Use Docker** for consistent environments
2. **Keep .env.example** in your repository
3. **Document any custom configurations**
4. **Test on each PC** after setup
5. **Use the same Node.js version** across PCs

## 🎉 **Success Indicators**

You'll know everything is working when:
- ✅ `npm run test-db` shows successful connection
- ✅ `npm run init-db` creates tables successfully
- ✅ `npm run dev` starts without errors
- ✅ http://localhost:3000/api-docs loads properly
- ✅ All API tests pass with `npm test`

Your backend will be identical across all PCs! 🚀
