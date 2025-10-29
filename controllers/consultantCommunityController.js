const { validationResult } = require('express-validator');
const ConsultantCommunity = require('../models/ConsultantCommunity');
const emailService = require('../services/emailService');
const eventEmitter = require('../services/eventEmitter');

// Submit consultant community membership form (Public)
const submitConsultantCommunity = async (req, res) => {
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

    const { 
      name, 
      emailAddress, 
      phoneNumber, 
      linkedInProfile, 
      company, 
      designation, 
      yearsOfExperience, 
      areasOfExpertise, 
      whyJoinCommunity, 
      howCanContribute, 
      email, 
      whatsapp, 
      slack, 
      openToMentoring, 
      agreement 
    } = req.body;

    // Create consultant community membership
    const consultantCommunity = await ConsultantCommunity.create({
      name,
      emailAddress,
      phoneNumber,
      linkedInProfile,
      company,
      designation,
      yearsOfExperience,
      areasOfExpertise,
      whyJoinCommunity,
      howCanContribute,
      email,
      whatsapp,
      slack,
      openToMentoring,
      agreement
    });

    // Send email notification (async, don't wait for it)
    emailService.sendConsultantCommunityNotification(consultantCommunity.toJSON())
      .then(result => {
        if (result.success) {
          console.log('📧 Consultant community notification sent successfully');
        } else {
          console.log('📧 Failed to send consultant community notification:', result.message);
        }
      })
      .catch(error => {
        console.error('📧 Email notification error:', error);
      });

    res.status(201).json({
      success: true,
      message: 'Your consultant community membership application has been submitted successfully. We will review and get back to you soon!',
      data: {
        consultantCommunity: consultantCommunity.toJSON()
      }
    });

    // Emit event for notification system (non-blocking)
    eventEmitter.emit('community:created', consultantCommunity.toJSON());
  } catch (error) {
    console.error('Consultant community submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit your application. Please try again later.'
    });
  }
};

// Get all consultant community memberships (Admin only)
const getAllConsultantCommunities = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const result = await ConsultantCommunity.findAll(parseInt(page), parseInt(pageSize));

    res.json({
      success: true,
      message: 'Consultant community memberships retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get consultant communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve consultant community memberships'
    });
  }
};

module.exports = {
  submitConsultantCommunity,
  getAllConsultantCommunities
};
