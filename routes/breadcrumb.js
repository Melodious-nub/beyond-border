const express = require('express');
const router = express.Router();
const breadcrumbController = require('../controllers/breadcrumbController');
const { authenticateToken } = require('../middleware/auth');
const { validateBreadcrumbCreation, validateBreadcrumbUpdate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Breadcrumb Management
 *   description: Simple breadcrumb management - page-wise breadcrumbs
 */

/**
 * @swagger
 * /api/breadcrumbs:
 *   post:
 *     summary: Create or update breadcrumb for a page (Admin only)
 *     tags: [Breadcrumb Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - page
 *               - pageTitle
 *               - pageDescription
 *             properties:
 *               page:
 *                 type: string
 *                 example: "about"
 *               pageTitle:
 *                 type: string
 *                 example: "About Us"
 *               pageDescription:
 *                 type: string
 *                 example: "About our company"
 *               bgColor:
 *                 type: string
 *                 example: "#ffffff"
 *     responses:
 *       201:
 *         description: Breadcrumb created/updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 */
router.post('/', authenticateToken, validateBreadcrumbCreation, breadcrumbController.createOrUpdateBreadcrumb);

/**
 * @swagger
 * /api/breadcrumbs/public:
 *   get:
 *     summary: Get all breadcrumbs (Public)
 *     tags: [Breadcrumb Management]
 *     security: []
 *     responses:
 *       200:
 *         description: Breadcrumbs retrieved successfully
 */
router.get('/public', breadcrumbController.getAllBreadcrumbsPublic);

/**
 * @swagger
 * /api/breadcrumbs/page/{page}:
 *   get:
 *     summary: Get breadcrumb by page name (Public)
 *     tags: [Breadcrumb Management]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Breadcrumb retrieved successfully
 *       404:
 *         description: Breadcrumb not found
 */
router.get('/page/:page', breadcrumbController.getBreadcrumbByPage);

/**
 * @swagger
 * /api/breadcrumbs:
 *   get:
 *     summary: Get all breadcrumbs (Admin only)
 *     tags: [Breadcrumb Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Breadcrumbs retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, breadcrumbController.getAllBreadcrumbs);

/**
 * @swagger
 * /api/breadcrumbs/{id}:
 *   get:
 *     summary: Get breadcrumb by ID (Admin only)
 *     tags: [Breadcrumb Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Breadcrumb retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Breadcrumb not found
 */
router.get('/:id', authenticateToken, breadcrumbController.getBreadcrumbById);

/**
 * @swagger
 * /api/breadcrumbs/{id}:
 *   put:
 *     summary: Update breadcrumb (Admin only)
 *     tags: [Breadcrumb Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageTitle:
 *                 type: string
 *                 example: "About Us - Updated"
 *               pageDescription:
 *                 type: string
 *                 example: "Updated description"
 *               bgColor:
 *                 type: string
 *                 example: "#f8f9fa"
 *     responses:
 *       200:
 *         description: Breadcrumb updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Breadcrumb not found
 */
router.put('/:id', authenticateToken, validateBreadcrumbUpdate, breadcrumbController.updateBreadcrumb);

/**
 * @swagger
 * /api/breadcrumbs/{id}:
 *   delete:
 *     summary: Delete breadcrumb (Admin only)
 *     tags: [Breadcrumb Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Breadcrumb deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Breadcrumb not found
 */
router.delete('/:id', authenticateToken, breadcrumbController.deleteBreadcrumb);

module.exports = router;