const { validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');

/**
 * Create a new testimonial (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTestimonial = async (req, res) => {
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
    const testimonialData = {
      name: req.body.name,
      department: req.body.department || null,
      designation: req.body.designation || null,
      description: req.body.description,
      image: req.file ? req.file.path : null // Handle file upload
    };

    // Create testimonial
    const testimonial = await Testimonial.create(testimonialData);

    // Replace image path with full URL
    const testimonialDataResponse = testimonial.toJSON();
    if (testimonialDataResponse.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = testimonialDataResponse.image.split(/[/\\]/).pop();
      testimonialDataResponse.image = `${req.protocol}://${req.get('host')}/uploads/testimonials/${filename}`;
    } else {
      testimonialDataResponse.image = null;
    }

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: {
        testimonial: testimonialDataResponse
      }
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial'
    });
  }
};

/**
 * Get all testimonials with pagination (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const result = await Testimonial.findAll(parseInt(page), parseInt(pageSize));

    // Replace image paths with full URLs for each testimonial
    if (result.items) {
      result.items = result.items.map(testimonial => {
        const testimonialData = testimonial.toJSON();
        if (testimonialData.image) {
          const filename = testimonialData.image.split(/[/\\]/).pop();
          testimonialData.image = `${req.protocol}://${req.get('host')}/uploads/testimonials/${filename}`;
        } else {
          testimonialData.image = null;
        }
        return testimonialData;
      });
    }

    res.json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonials'
    });
  }
};

/**
 * Get testimonial by ID (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Replace image path with full URL
    const testimonialData = testimonial.toJSON();
    if (testimonialData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = testimonialData.image.split(/[/\\]/).pop();
      testimonialData.image = `${req.protocol}://${req.get('host')}/uploads/testimonials/${filename}`;
    } else {
      testimonialData.image = null;
    }

    res.json({
      success: true,
      message: 'Testimonial retrieved successfully',
      data: {
        testimonial: testimonialData
      }
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonial'
    });
  }
};

/**
 * Update testimonial (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTestimonial = async (req, res) => {
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

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Extract data from request body and file
    const updateData = {
      name: req.body.name,
      department: req.body.department || null,
      designation: req.body.designation || null,
      description: req.body.description
    };

    // Handle image update
    if (req.file) {
      updateData.image = req.file.path;
    }

    await testimonial.update(updateData);

    // Replace image path with full URL
    const testimonialData = testimonial.toJSON();
    if (testimonialData.image) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = testimonialData.image.split(/[/\\]/).pop();
      testimonialData.image = `${req.protocol}://${req.get('host')}/uploads/testimonials/${filename}`;
    } else {
      testimonialData.image = null;
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: {
        testimonial: testimonialData
      }
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial'
    });
  }
};

/**
 * Delete testimonial (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await testimonial.delete();
    
    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
};

/**
 * Get all testimonials (Public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTestimonialsPublic = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAllPublic();

    // Replace image paths with full URLs for each testimonial
    const testimonialsWithUrls = testimonials.map(testimonial => {
      const testimonialData = testimonial.toJSON();
      if (testimonialData.image) {
        const filename = testimonialData.image.split(/[/\\]/).pop();
        testimonialData.image = `${req.protocol}://${req.get('host')}/uploads/testimonials/${filename}`;
      } else {
        testimonialData.image = null;
      }
      return testimonialData;
    });

    res.json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: {
        testimonials: testimonialsWithUrls
      }
    });
  } catch (error) {
    console.error('Get public testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonials'
    });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonialsPublic
};
