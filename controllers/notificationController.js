const Notification = require('../models/Notification');
const NotificationEmail = require('../models/NotificationEmail');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

/**
 * Get all notifications with pagination (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getNotifications = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, unreadOnly = false } = req.query;

    let result;
    if (unreadOnly === 'true') {
      result = await Notification.findUnread(parseInt(page), parseInt(pageSize));
    } else {
      result = await Notification.findAll(parseInt(page), parseInt(pageSize));
    }

    res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications'
    });
  }
};

/**
 * Get unread notification count (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount();

    res.json({
      success: true,
      message: 'Unread count retrieved successfully',
      data: {
        count
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve unread count'
    });
  }
};

/**
 * Mark notification as read (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification: notification.toJSON()
      }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

/**
 * Mark all notifications as read (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead();

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

/**
 * Delete notification (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.delete();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

/**
 * SSE stream endpoint for real-time notifications (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notificationStream = async (req, res) => {
  try {
    console.log('🔌 SSE stream endpoint hit by user:', req.user.email);
    
    // Get user ID from authenticated user
    const userId = req.user.id;

    // Add client to notification service
    notificationService.addClient(userId, res);

    // Send initial unread count
    const unreadCount = await Notification.getUnreadCount();
    console.log(`📊 Sending initial unread count: ${unreadCount}`);
    
    notificationService.sendToClient(userId, {
      type: 'unread_count',
      data: { count: unreadCount },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ SSE stream error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to establish SSE connection'
    });
  }
};

/**
 * Get SSE connection stats (Admin only - for debugging)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getConnectionStats = async (req, res) => {
  try {
    const stats = notificationService.getStats();

    res.json({
      success: true,
      message: 'Connection stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Get connection stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve connection stats'
    });
  }
};

// ==================== EMAIL NOTIFICATION MANAGEMENT ====================

/**
 * Add notification email (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addNotificationEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Check if email already exists
    const existingEmail = await NotificationEmail.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'This email is already in the notification list'
      });
    }

    // Add email
    const notificationEmailId = await NotificationEmail.create(email);
    const notificationEmail = await NotificationEmail.findByEmail(email);

    res.status(201).json({
      success: true,
      message: 'Notification email added successfully',
      data: {
        notificationEmail: notificationEmail.toJSON()
      }
    });
  } catch (error) {
    console.error('Add notification email error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'This email is already in the notification list'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add notification email'
    });
  }
};

/**
 * Get all notification emails (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllNotificationEmails = async (req, res) => {
  try {
    const notificationEmails = await NotificationEmail.findAll();

    res.json({
      success: true,
      message: 'Notification emails retrieved successfully',
      data: {
        notificationEmails: notificationEmails.map(email => email.toJSON())
      }
    });
  } catch (error) {
    console.error('Get notification emails error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notification emails'
    });
  }
};

/**
 * Delete notification email (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteNotificationEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const notificationEmail = await NotificationEmail.findByEmail(email);
    if (!notificationEmail) {
      return res.status(404).json({
        success: false,
        message: 'Notification email not found'
      });
    }

    await notificationEmail.delete();

    res.json({
      success: true,
      message: 'Notification email deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification email'
    });
  }
};

/**
 * Test email configuration (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const testEmailConfiguration = async (req, res) => {
  try {
    const result = await emailService.testEmailConfiguration();

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully. Please check your inbox.',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || 'Failed to send test email'
      });
    }
  } catch (error) {
    console.error('Test email configuration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test email configuration'
    });
  }
};

/**
 * Send custom notification to all notification emails (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendCustomNotification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subject, message } = req.body;

    // Get all notification emails
    const notificationEmails = await NotificationEmail.findAll();

    if (notificationEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No notification emails configured. Please add notification emails first.'
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send to all notification emails
    for (const notificationEmail of notificationEmails) {
      try {
        const result = await emailService.sendCustomNotification(
          notificationEmail.email,
          subject,
          message
        );

        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
        console.error(`Failed to send to ${notificationEmail.email}:`, error);
      }
    }

    res.json({
      success: true,
      message: `Notification sent to ${sentCount} email address${sentCount !== 1 ? 'es' : ''}`,
      data: {
        sentCount,
        failedCount,
        totalConfigured: notificationEmails.length
      }
    });
  } catch (error) {
    console.error('Send custom notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send custom notification'
    });
  }
};

module.exports = {
  // Real-time notification endpoints
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notificationStream,
  getConnectionStats,
  // Email notification management endpoints
  addNotificationEmail,
  getAllNotificationEmails,
  deleteNotificationEmail,
  testEmailConfiguration,
  sendCustomNotification
};
