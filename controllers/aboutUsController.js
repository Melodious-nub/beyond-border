const { validationResult } = require('express-validator');
const AboutUs = require('../models/AboutUs');

/**
 * Create or update about us (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createOrUpdateAboutUs = async (req, res) => {
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

    // Extract data from request body and file
    const aboutUsData = {
      description: req.body.description,
      image: req.file ? req.file.path : null // Handle file upload
    };

    // Create or update about us
    const aboutUs = await AboutUs.createOrUpdate(aboutUsData);

    // Replace image path with full URL
    const itemData = aboutUs.toJSON();
    if (itemData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = itemData.image.split(/[/\\]/).pop();
      itemData.image = `${req.protocol}://${req.get('host')}/uploads/about-us/${filename}`;
    } else {
      itemData.image = null;
    }

    res.status(201).json({
      success: true,
      message: 'About us updated successfully',
      data: {
        aboutUs: itemData
      }
    });
  } catch (error) {
    console.error('Create/Update about us error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update about us'
    });
  }
};

/**
 * Get about us (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findFirst();
    
    if (!aboutUs) {
      return res.status(404).json({
        success: false,
        message: 'About us content not found'
      });
    }

    // Replace image path with full URL
    const itemData = aboutUs.toJSON();
    if (itemData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = itemData.image.split(/[/\\]/).pop();
      itemData.image = `${req.protocol}://${req.get('host')}/uploads/about-us/${filename}`;
    } else {
      itemData.image = null;
    }

    res.json({
      success: true,
      message: 'About us retrieved successfully',
      data: {
        aboutUs: itemData
      }
    });
  } catch (error) {
    console.error('Get about us error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve about us'
    });
  }
};

/**
 * Get about us (Public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAboutUsPublic = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findFirst();
    
    if (!aboutUs) {
      return res.status(404).json({
        success: false,
        message: 'About us content not found'
      });
    }

    // Replace image path with full URL
    const itemData = aboutUs.toJSON();
    if (itemData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = itemData.image.split(/[/\\]/).pop();
      itemData.image = `${req.protocol}://${req.get('host')}/uploads/about-us/${filename}`;
    } else {
      itemData.image = null;
    }

    res.json({
      success: true,
      message: 'About us retrieved successfully',
      data: {
        aboutUs: itemData
      }
    });
  } catch (error) {
    console.error('Get public about us error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve about us'
    });
  }
};

module.exports = {
  createOrUpdateAboutUs,
  getAboutUs,
  getAboutUsPublic
};
