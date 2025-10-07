const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const NotificationEmail = require('../models/NotificationEmail');
const emailService = require('../services/emailService');

// Submit contact form (Public)
const submitContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, description } = req.body;

    // Create contact message
    const contact = await Contact.create({
      name,
      email,
      description
    });

    // Send email notification (async, don't wait for it)
    emailService.sendContactNotification(contact.toJSON())
      .then(result => {
        if (result.success) {
          console.log('📧 Contact notification sent successfully');
        } else {
          console.log('📧 Failed to send contact notification:', result.message);
        }
      })
      .catch(error => {
        console.error('📧 Email notification error:', error);
      });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: {
        contact: contact.toJSON()
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again later.'
    });
  }
};

// Get all contact messages (Admin only)
const getAllContacts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const result = await Contact.findAll(parseInt(page), parseInt(pageSize));

    res.json({
      success: true,
      message: 'Contact messages retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact messages'
    });
  }
};

// Set notification email (Admin only)
const setNotificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

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
    console.error('Set notification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add notification email'
    });
  }
};

// Delete notification email (Admin only)
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

// List notification emails (Admin only)
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

// Test email configuration (Admin only)
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

module.exports = {
  submitContact,
  getAllContacts,
  setNotificationEmail,
  deleteNotificationEmail,
  listNotificationEmails,
  testEmailConfiguration
};
