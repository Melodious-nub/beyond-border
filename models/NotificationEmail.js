const { pool } = require('../config/database');

class NotificationEmail {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.createdAt = data.createdAt;
  }

  // Create a new notification email
  static async create(email) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO notification_emails (email) VALUES (?)',
        [email]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get all notification emails
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM notification_emails ORDER BY createdAt DESC'
      );
      
      return rows.map(row => new NotificationEmail(row));
    } catch (error) {
      throw error;
    }
  }

  // Find notification email by email address
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM notification_emails WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? new NotificationEmail(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Delete notification email
  async delete() {
    try {
      await pool.execute('DELETE FROM notification_emails WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get user data without sensitive information
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt
    };
  }
}

module.exports = NotificationEmail;
