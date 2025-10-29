const { pool } = require('../config/database');

class Notification {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.message = data.message;
    this.route = data.route;
    this.targetRoute = data.targetRoute;
    this.referenceId = data.referenceId;
    this.type = data.type;
    this.isRead = data.isRead || false;
    this.createdAt = data.createdAt;
  }

  // Create a new notification
  static async create(notificationData) {
    try {
      const { title, message, route, targetRoute, referenceId, type } = notificationData;
      
      const [result] = await pool.execute(
        'INSERT INTO notifications (title, message, route, targetRoute, referenceId, type) VALUES (?, ?, ?, ?, ?, ?)',
        [title, message, route, targetRoute, referenceId, type]
      );

      // Return the created notification
      const [rows] = await pool.execute(
        'SELECT * FROM notifications WHERE id = ?',
        [result.insertId]
      );

      return rows.length > 0 ? new Notification(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find notification by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM notifications WHERE id = ?',
        [id]
      );

      return rows.length > 0 ? new Notification(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all notifications with pagination
  static async findAll(page = 1, pageSize = 20) {
    try {
      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);
      const offsetInt = parseInt(offset);

      // Get total count
      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM notifications'
      );
      const total = countResult[0].total;

      // Get paginated notifications (use query instead of execute for LIMIT/OFFSET)
      const [rows] = await pool.query(
        `SELECT * FROM notifications ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offsetInt}`
      );

      const notifications = rows.map(row => new Notification(row));

      return {
        notifications,
        pagination: {
          page,
          pageSize,
          total,
          pages: Math.ceil(total / pageSize)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get unread notifications
  static async findUnread(page = 1, pageSize = 20) {
    try {
      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);
      const offsetInt = parseInt(offset);

      // Get total count of unread
      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM notifications WHERE isRead = FALSE'
      );
      const total = countResult[0].total;

      // Get paginated unread notifications (use query instead of execute for LIMIT/OFFSET)
      const [rows] = await pool.query(
        `SELECT * FROM notifications WHERE isRead = FALSE ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offsetInt}`
      );

      const notifications = rows.map(row => new Notification(row));

      return {
        notifications,
        pagination: {
          page,
          pageSize,
          total,
          pages: Math.ceil(total / pageSize)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount() {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM notifications WHERE isRead = FALSE'
      );

      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead() {
    try {
      await pool.execute(
        'UPDATE notifications SET isRead = TRUE WHERE id = ?',
        [this.id]
      );

      this.isRead = true;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      await pool.execute('UPDATE notifications SET isRead = TRUE WHERE isRead = FALSE');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Delete notification
  async delete() {
    try {
      await pool.execute('DELETE FROM notifications WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get notification data as JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      message: this.message,
      route: this.route,
      targetRoute: this.targetRoute,
      referenceId: this.referenceId,
      type: this.type,
      isRead: Boolean(this.isRead),
      createdAt: this.createdAt
    };
  }
}

module.exports = Notification;

