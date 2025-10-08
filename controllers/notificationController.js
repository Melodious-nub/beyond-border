const { validationResult } = require('express-validator');
const NotificationEmail = require('../models/NotificationEmail');
const emailService = require('../services/emailService');

/**
 * Add notification email (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addNotificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic email validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists
    const existingEmail = await NotificationEmail.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists in notification list'
      });
    }

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
    res.status(500).json({
      success: false,
      message: 'Failed to add notification email'
    });
  }
};

/**
 * List all notification emails (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listNotificationEmails = async (req, res) => {
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
    console.error('List notification emails error:', error);
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
        message: 'Test email sent successfully',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        data: result
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
};

/**
 * Send notification to all configured emails (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendNotification = async (req, res) => {
  try {
    const { subject, message } = req.body;

    // Validation
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    if (subject.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Subject must be less than 200 characters'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be less than 2000 characters'
      });
    }

    // Get all notification emails
    const notificationEmails = await NotificationEmail.findAll();
    
    if (notificationEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No notification emails configured'
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send email to each notification address
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
          console.error(`Failed to send notification to ${notificationEmail.email}:`, result.message);
        }
      } catch (error) {
        failedCount++;
        console.error(`Error sending notification to ${notificationEmail.email}:`, error);
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
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification'
    });
  }
};

module.exports = {
  addNotificationEmail,
  listNotificationEmails,
  deleteNotificationEmail,
  testEmailConfiguration,
  sendNotification
};
