@echo off
echo ========================================
echo MySQL Setup for Beyond Border Backend
echo ========================================
echo.

echo This script will set up MySQL with the following configuration:
echo - Database: db
echo - Username: admin
echo - Password: root
echo - Host: localhost
echo - Port: 3306
echo.

pause

echo.
echo Running MySQL setup script...
echo.

mysql -u root -p < setup-mysql.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ MySQL setup completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Copy your project to this PC
    echo 2. Run: npm install
    echo 3. Run: npm run test-db
    echo 4. Run: npm run init-db
    echo 5. Run: npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ MySQL setup failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL Server is installed and running
    echo 2. You have root access to MySQL
    echo 3. The setup-mysql.sql file exists
    echo.
)

pause
