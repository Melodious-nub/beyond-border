const Breadcrumb = require('../models/Breadcrumb');
const Page = require('../models/Page');

/**
 * Create or update breadcrumb for a page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createOrUpdateBreadcrumb = async (req, res) => {
  try {
    const { page, pageTitle, pageDescription, bgColor } = req.body;

    // Check if page exists
    const pageExists = await Page.findByPage(page);
    if (!pageExists) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    const breadcrumb = await Breadcrumb.createOrUpdate({
      page,
      pageTitle,
      pageDescription,
      bgColor
    });

    res.status(201).json({
      success: true,
      message: 'Breadcrumb created/updated successfully',
      data: {
        breadcrumb: breadcrumb.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create/update breadcrumb'
    });
  }
};

/**
 * Get all breadcrumbs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllBreadcrumbs = async (req, res) => {
  try {
    const breadcrumbs = await Breadcrumb.findAll();

    res.json({
      success: true,
      message: 'Breadcrumbs retrieved successfully',
      data: {
        breadcrumbs: breadcrumbs.map(breadcrumb => breadcrumb.toJSON())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve breadcrumbs'
    });
  }
};

/**
 * Get breadcrumb by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBreadcrumbById = async (req, res) => {
  try {
    const { id } = req.params;

    const breadcrumb = await Breadcrumb.findById(id);
    if (!breadcrumb) {
      return res.status(404).json({
        success: false,
        message: 'Breadcrumb not found'
      });
    }

    res.json({
      success: true,
      message: 'Breadcrumb retrieved successfully',
      data: {
        breadcrumb: breadcrumb.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve breadcrumb'
    });
  }
};

/**
 * Get all breadcrumbs (public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllBreadcrumbsPublic = async (req, res) => {
  try {
    const breadcrumbs = await Breadcrumb.findAll();

    res.json({
      success: true,
      message: 'Breadcrumbs retrieved successfully',
      data: {
        breadcrumbs: breadcrumbs.map(breadcrumb => breadcrumb.toJSON())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve breadcrumbs'
    });
  }
};

/**
 * Get breadcrumb by page name (public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBreadcrumbByPage = async (req, res) => {
  try {
    const { page } = req.params;

    const breadcrumb = await Breadcrumb.findByPage(page);
    if (!breadcrumb) {
      return res.status(404).json({
        success: false,
        message: 'Breadcrumb not found'
      });
    }

    res.json({
      success: true,
      message: 'Breadcrumb retrieved successfully',
      data: {
        breadcrumb: breadcrumb.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve breadcrumb'
    });
  }
};

/**
 * Update breadcrumb
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateBreadcrumb = async (req, res) => {
  try {
    const { id } = req.params;
    const { pageTitle, pageDescription, bgColor } = req.body;

    const breadcrumb = await Breadcrumb.findById(id);
    if (!breadcrumb) {
      return res.status(404).json({
        success: false,
        message: 'Breadcrumb not found'
      });
    }

    await breadcrumb.update({
      pageTitle,
      pageDescription,
      bgColor
    });

    res.json({
      success: true,
      message: 'Breadcrumb updated successfully',
      data: {
        breadcrumb: breadcrumb.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update breadcrumb'
    });
  }
};

/**
 * Delete breadcrumb
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteBreadcrumb = async (req, res) => {
  try {
    const { id } = req.params;

    const breadcrumb = await Breadcrumb.findById(id);
    if (!breadcrumb) {
      return res.status(404).json({
        success: false,
        message: 'Breadcrumb not found'
      });
    }

    await breadcrumb.delete();
    
    res.json({
      success: true,
      message: 'Breadcrumb deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete breadcrumb'
    });
  }
};

module.exports = {
  createOrUpdateBreadcrumb,
  getAllBreadcrumbs,
  getBreadcrumbById,
  getAllBreadcrumbsPublic,
  getBreadcrumbByPage,
  updateBreadcrumb,
  deleteBreadcrumb
};