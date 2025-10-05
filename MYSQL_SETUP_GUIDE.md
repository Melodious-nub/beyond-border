# MySQL Server Setup Guide for New PC

This guide will help you set up MySQL Server on a new PC with the same credentials as your current setup.

## 🎯 **Target Configuration**
- **Database Name**: `db`
- **Username**: `admin`
- **Password**: `root`
- **Host**: `localhost`
- **Port**: `3306`

## 📥 **Step 1: Install MySQL Server**

### Download MySQL Server
1. Go to: https://dev.mysql.com/downloads/mysql/
2. Select **MySQL Community Server**
3. Choose your operating system (Windows, macOS, Linux)
4. Download the **MySQL Installer for Windows** (recommended for Windows)

### Install MySQL Server
1. **Run the installer** as Administrator
2. **Choose Setup Type**: Select "Developer Default" or "Server only"
3. **Check Requirements**: Install any missing dependencies
4. **Installation**: Click "Execute" to install MySQL Server
5. **Configuration**: Follow the configuration wizard

## ⚙️ **Step 2: Configure MySQL Server**

### Initial Configuration
1. **Config Type**: Choose "Development Computer"
2. **Connectivity**: 
   - Port: `3306` (default)
   - Open Windows Firewall ports: ✅ Yes
3. **Authentication Method**: 
   - Choose "Use Strong Password Encryption for Authentication"
4. **Accounts and Roles**:
   - **Root Password**: Set a strong password (remember this!)
   - **MySQL User Accounts**: You can add users later

### Complete Installation
1. **Windows Service**: Configure MySQL as a Windows Service
2. **Apply Configuration**: Execute the configuration
3. **Finish**: Complete the installation

## 👤 **Step 3: Create Database and User**

### Method 1: Using MySQL Command Line Client

1. **Open MySQL Command Line Client**:
   - Search for "MySQL Command Line Client" in Start Menu
   - Enter your root password when prompted

2. **Create Database**:
   ```sql
   CREATE DATABASE db;
   ```

3. **Create User**:
   ```sql
   CREATE USER 'admin'@'localhost' IDENTIFIED BY 'root';
   ```

4. **Grant Privileges**:
   ```sql
   GRANT ALL PRIVILEGES ON db.* TO 'admin'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. **Verify Setup**:
   ```sql
   SHOW DATABASES;
   SELECT User, Host FROM mysql.user WHERE User = 'admin';
   ```

6. **Exit MySQL**:
   ```sql
   EXIT;
   ```

### Method 2: Using MySQL Workbench (GUI)

1. **Open MySQL Workbench**:
   - Search for "MySQL Workbench" in Start Menu
   - Connect to your local MySQL instance using root credentials

2. **Create Database**:
   - Right-click in the Navigator panel
   - Select "Create Schema..."
   - Name: `db`
   - Click "Apply"

3. **Create User**:
   - Go to "Server" → "Users and Privileges"
   - Click "Add Account"
   - **Login Name**: `admin`
   - **Authentication Type**: Standard
   - **Password**: `root`
   - **Confirm Password**: `root`
   - Click "Apply"

4. **Grant Privileges**:
   - In the same user account
   - Go to "Schema Privileges" tab
   - Click "Add Entry"
   - Select "db" database
   - Grant "All" privileges
   - Click "Apply"

## 🔧 **Step 4: Test Connection**

### Test with MySQL Command Line
```bash
mysql -u admin -p -h localhost
# Enter password: root
```

### Test with Your Backend
1. **Copy your project** to the new PC
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Test database connection**:
   ```bash
   npm run test-db
   ```
4. **Initialize database**:
   ```bash
   npm run init-db
   ```
5. **Start the application**:
   ```bash
   npm run dev
   ```

## 🚨 **Troubleshooting**

### Common Issues

#### "Access denied for user 'admin'@'localhost'"
```sql
-- Check if user exists
SELECT User, Host FROM mysql.user WHERE User = 'admin';

-- If user doesn't exist, create it
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

#### "Can't connect to MySQL server"
- **Check MySQL Service**: Make sure MySQL service is running
- **Windows Services**: Search "Services" → Find "MySQL80" → Start if stopped
- **Port 3306**: Ensure port 3306 is not blocked by firewall

#### "Unknown database 'db'"
```sql
-- Create the database
CREATE DATABASE db;
```

### Reset User Password
```sql
-- If you forget the admin password
ALTER USER 'admin'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
```

## 📋 **Quick Setup Script**

Create a file called `setup-mysql.sql` and run it:

```sql
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
```

Run this script:
```bash
mysql -u root -p < setup-mysql.sql
```

## ✅ **Verification Checklist**

- [ ] MySQL Server installed and running
- [ ] Database `db` created
- [ ] User `admin` created with password `root`
- [ ] User has all privileges on `db` database
- [ ] Can connect with: `mysql -u admin -p -h localhost`
- [ ] Backend can connect: `npm run test-db`
- [ ] Backend can initialize: `npm run init-db`
- [ ] Application starts: `npm run dev`

## 🔄 **For Multiple PCs**

To set up the same configuration on multiple PCs:

1. **Save this guide** for reference
2. **Use the same credentials** everywhere
3. **Copy your .env file** to each PC
4. **Run the setup script** on each PC
5. **Test with `npm run test-db`** on each PC

## 📞 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section above
2. Verify MySQL service is running
3. Check Windows Firewall settings
4. Ensure port 3306 is not blocked
5. Try connecting with MySQL Workbench first

## 🎯 **Final Result**

After following this guide, you should have:
- MySQL Server running on port 3306
- Database named `db`
- User `admin` with password `root`
- Full access to the `db` database
- Your backend application working perfectly

Your setup will be identical across all PCs! 🚀
