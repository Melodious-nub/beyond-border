const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');
const eventEmitter = require('../services/eventEmitter');

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

    // Emit event for notification system (non-blocking)
    eventEmitter.emit('contact:created', contact.toJSON());
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


module.exports = {
  submitContact,
  getAllContacts
};
