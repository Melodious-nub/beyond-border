const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'admin';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new user
  static async create(userData) {
    try {
      const { fullName, email, password, role = 'admin' } = userData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const [result] = await pool.execute(
        'INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)',
        [fullName, email, hashedPassword, role]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Check if email exists
  static async emailExists(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  }

  // Get user data without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  // Update user
  async update(updateData) {
    try {
      const allowedFields = ['fullName', 'email', 'role'];
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(this.id);

      await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Update local instance
      Object.assign(this, updateData);
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async delete() {
    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
