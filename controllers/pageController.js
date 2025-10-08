const Page = require('../models/Page');
const Breadcrumb = require('../models/Breadcrumb');

/**
 * Create a new page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPage = async (req, res) => {
  try {
    const { page } = req.body;

    // Check if page already exists
    const existingPage = await Page.findByPage(page);
    if (existingPage) {
      return res.status(409).json({
        success: false,
        message: 'Page with this name already exists'
      });
    }

    const newPage = await Page.create({ page });

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: {
        page: newPage.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create page'
    });
  }
};

/**
 * Get all pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll();

    res.json({
      success: true,
      message: 'Pages retrieved successfully',
      data: {
        pages: pages.map(page => page.toJSON())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pages'
    });
  }
};

/**
 * Get page by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    res.json({
      success: true,
      message: 'Page retrieved successfully',
      data: {
        page: page.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve page'
    });
  }
};

/**
 * Get all pages (public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPagesPublic = async (req, res) => {
  try {
    const pages = await Page.findAll();

    res.json({
      success: true,
      message: 'Pages retrieved successfully',
      data: {
        pages: pages.map(page => page.toJSON())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pages'
    });
  }
};

/**
 * Get page by name (public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPageByName = async (req, res) => {
  try {
    const { page } = req.params;

    const pageData = await Page.findByPage(page);
    if (!pageData) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    res.json({
      success: true,
      message: 'Page retrieved successfully',
      data: {
        page: pageData.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve page'
    });
  }
};

/**
 * Update page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { page } = req.body;

    const pageData = await Page.findById(id);
    if (!pageData) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    // Check if new page name already exists (excluding current page)
    if (page !== pageData.page) {
      const existingPage = await Page.findByPage(page);
      if (existingPage) {
        return res.status(409).json({
          success: false,
          message: 'Page with this name already exists'
        });
      }
    }

    await pageData.update({ page });

    res.json({
      success: true,
      message: 'Page updated successfully',
      data: {
        page: pageData.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update page'
    });
  }
};

/**
 * Delete page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    // Delete associated breadcrumb first
    await Breadcrumb.deleteByPage(page.page);
    await page.delete();
    
    res.json({
      success: true,
      message: 'Page and associated breadcrumb deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete page'
    });
  }
};

module.exports = {
  createPage,
  getAllPages,
  getPageById,
  getAllPagesPublic,
  getPageByName,
  updatePage,
  deletePage
};