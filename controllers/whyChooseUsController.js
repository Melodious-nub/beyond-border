const { validationResult } = require('express-validator');
const WhyChooseUs = require('../models/WhyChooseUs');

/**
 * Create a new why choose us item (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createWhyChooseUs = async (req, res) => {
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
    const whyChooseUsData = {
      title: req.body.title,
      details: req.body.details,
      image: req.file ? req.file.path : null // Handle file upload
    };

    // Create why choose us item
    const whyChooseUs = await WhyChooseUs.create(whyChooseUsData);

    // Replace image path with full URL
    const itemData = whyChooseUs.toJSON();
    if (itemData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = itemData.image.split(/[/\\]/).pop();
      itemData.image = `${req.protocol}://${req.get('host')}/uploads/why-choose-us/${filename}`;
    } else {
      itemData.image = null;
    }

    res.status(201).json({
      success: true,
      message: 'Why choose us item created successfully',
      data: {
        whyChooseUs: itemData
      }
    });
  } catch (error) {
    console.error('Create why choose us error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create why choose us item'
    });
  }
};

/**
 * Get all why choose us items with pagination (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllWhyChooseUs = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const result = await WhyChooseUs.findAll(parseInt(page), parseInt(pageSize));

    // Replace image paths with full URLs for each item
    if (result.items) {
      result.items = result.items.map(item => {
        const itemData = item.toJSON();
        if (itemData.image) {
          const filename = itemData.image.split(/[/\\]/).pop();
          itemData.image = `${req.protocol}://${req.get('host')}/uploads/why-choose-us/${filename}`;
        } else {
          itemData.image = null;
        }
        return itemData;
      });
    }

    res.json({
      success: true,
      message: 'Why choose us items retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get why choose us items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve why choose us items'
    });
  }
};

/**
 * Get why choose us item by ID (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getWhyChooseUsById = async (req, res) => {
  try {
    const { id } = req.params;

    const whyChooseUs = await WhyChooseUs.findById(id);
    if (!whyChooseUs) {
      return res.status(404).json({
        success: false,
        message: 'Why choose us item not found'
      });
    }

    // Replace image path with full URL
    const itemData = whyChooseUs.toJSON();
    if (itemData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = itemData.image.split(/[/\\]/).pop();
      itemData.image = `${req.protocol}://${req.get('host')}/uploads/why-choose-us/${filename}`;
    } else {
      itemData.image = null;
    }

    res.json({
      success: true,
      message: 'Why choose us item retrieved successfully',
      data: {
        whyChooseUs: itemData
      }
    });
  } catch (error) {
    console.error('Get why choose us item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve why choose us item'
    });
  }
};

/**
 * Update why choose us item (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateWhyChooseUs = async (req, res) => {
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

    const { id } = req.params;

    const whyChooseUs = await WhyChooseUs.findById(id);
    if (!whyChooseUs) {
      return res.status(404).json({
        success: false,
        message: 'Why choose us item not found'
      });
    }

    // Extract data from request body and file
    const updateData = {
      title: req.body.title,
      details: req.body.details
    };

    // Handle image update
    if (req.file) {
      updateData.image = req.file.path;
    }

    await whyChooseUs.update(updateData);

    // Replace image path with full URL
    const itemData = whyChooseUs.toJSON();
    if (itemData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = itemData.image.split(/[/\\]/).pop();
      itemData.image = `${req.protocol}://${req.get('host')}/uploads/why-choose-us/${filename}`;
    } else {
      itemData.image = null;
    }

    res.json({
      success: true,
      message: 'Why choose us item updated successfully',
      data: {
        whyChooseUs: itemData
      }
    });
  } catch (error) {
    console.error('Update why choose us item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update why choose us item'
    });
  }
};

/**
 * Delete why choose us item (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteWhyChooseUs = async (req, res) => {
  try {
    const { id } = req.params;

    const whyChooseUs = await WhyChooseUs.findById(id);
    if (!whyChooseUs) {
      return res.status(404).json({
        success: false,
        message: 'Why choose us item not found'
      });
    }

    await whyChooseUs.delete();
    
    res.json({
      success: true,
      message: 'Why choose us item deleted successfully'
    });
  } catch (error) {
    console.error('Delete why choose us item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete why choose us item'
    });
  }
};

/**
 * Get all why choose us items (Public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllWhyChooseUsPublic = async (req, res) => {
  try {
    const whyChooseUsItems = await WhyChooseUs.findAllPublic();

    // Replace image paths with full URLs for each item
    const itemsWithUrls = whyChooseUsItems.map(item => {
      const itemData = item.toJSON();
      if (itemData.image) {
        const filename = itemData.image.split(/[/\\]/).pop();
        itemData.image = `${req.protocol}://${req.get('host')}/uploads/why-choose-us/${filename}`;
      } else {
        itemData.image = null;
      }
      return itemData;
    });

    res.json({
      success: true,
      message: 'Why choose us items retrieved successfully',
      data: {
        whyChooseUsItems: itemsWithUrls
      }
    });
  } catch (error) {
    console.error('Get public why choose us items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve why choose us items'
    });
  }
};

module.exports = {
  createWhyChooseUs,
  getAllWhyChooseUs,
  getWhyChooseUsById,
  updateWhyChooseUs,
  deleteWhyChooseUs,
  getAllWhyChooseUsPublic
};
