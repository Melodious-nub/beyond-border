const Consultant = require('../models/Consultant');
const EmailService = require('../services/emailService');

/**
 * Create a new consultant request (Public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createConsultantRequest = async (req, res) => {
  try {
    const consultantData = req.body;

    // Create consultant request
    const consultant = await Consultant.create(consultantData);

    // Send email notification
    try {
      await EmailService.sendConsultantRequestNotification(consultant.toJSON());
    } catch (emailError) {
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Consultant request submitted successfully',
      data: {
        consultant: consultant.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit consultant request'
    });
  }
};

/**
 * Get all consultant requests with pagination (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllConsultantRequests = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const result = await Consultant.findAll(parseInt(page), parseInt(pageSize));

    res.json({
      success: true,
      message: 'Consultant requests retrieved successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve consultant requests'
    });
  }
};

/**
 * Get consultant request by ID (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getConsultantRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const consultant = await Consultant.findById(id);
    if (!consultant) {
      return res.status(404).json({
        success: false,
        message: 'Consultant request not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultant request retrieved successfully',
      data: {
        consultant: consultant.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve consultant request'
    });
  }
};


/**
 * Delete consultant request (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteConsultantRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const consultant = await Consultant.findById(id);
    if (!consultant) {
      return res.status(404).json({
        success: false,
        message: 'Consultant request not found'
      });
    }

    await consultant.delete();
    
    res.json({
      success: true,
      message: 'Consultant request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete consultant request'
    });
  }
};

module.exports = {
  createConsultantRequest,
  getAllConsultantRequests,
  getConsultantRequestById,
  deleteConsultantRequest
};
