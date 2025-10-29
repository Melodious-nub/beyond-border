const { pool } = require('./config/database');

async function verifyTable() {
  try {
    console.log('🔍 Checking notifications table...');
    
    // Check if table exists
    const [tables] = await pool.query(
      "SHOW TABLES LIKE 'notifications'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Notifications table does not exist!');
      console.log('Creating notifications table...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          route VARCHAR(255) NOT NULL,
          targetRoute VARCHAR(255) NOT NULL,
          referenceId INT NOT NULL,
          type ENUM('contact', 'consultant', 'community') NOT NULL,
          isRead BOOLEAN DEFAULT FALSE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_isRead (isRead),
          INDEX idx_type (type),
          INDEX idx_createdAt (createdAt)
        )
      `);
      
      console.log('✅ Notifications table created successfully!');
    } else {
      console.log('✅ Notifications table exists!');
      
      // Check structure
      const [columns] = await pool.query(
        "DESCRIBE notifications"
      );
      
      console.log('\n📋 Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
      });
      
      // Check if there are any notifications
      const [count] = await pool.query(
        "SELECT COUNT(*) as count FROM notifications"
      );
      
      console.log(`\n📊 Total notifications: ${count[0].count}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyTable();

