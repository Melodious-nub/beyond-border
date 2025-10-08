const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { authenticateToken } = require('../middleware/auth');
const { validatePageCreation, validatePageUpdate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Page Management
 *   description: Simple page management - just page names
 */

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Create a new page (Admin only)
 *     tags: [Page Management]
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
 *             properties:
 *               page:
 *                 type: string
 *                 example: "about"
 *     responses:
 *       201:
 *         description: Page created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Page with this name already exists
 */
router.post('/', authenticateToken, validatePageCreation, pageController.createPage);

/**
 * @swagger
 * /api/pages/public:
 *   get:
 *     summary: Get all pages (Public)
 *     tags: [Page Management]
 *     security: []
 *     responses:
 *       200:
 *         description: Pages retrieved successfully
 */
router.get('/public', pageController.getAllPagesPublic);

/**
 * @swagger
 * /api/pages/name/{page}:
 *   get:
 *     summary: Get page by name (Public)
 *     tags: [Page Management]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page retrieved successfully
 *       404:
 *         description: Page not found
 */
router.get('/name/:page', pageController.getPageByName);

/**
 * @swagger
 * /api/pages:
 *   get:
 *     summary: Get all pages (Admin only)
 *     tags: [Page Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pages retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, pageController.getAllPages);

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     summary: Get page by ID (Admin only)
 *     tags: [Page Management]
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
 *         description: Page retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 */
router.get('/:id', authenticateToken, pageController.getPageById);

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     summary: Update page (Admin only)
 *     tags: [Page Management]
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
 *               page:
 *                 type: string
 *                 example: "about-updated"
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 *       409:
 *         description: Page with this name already exists
 */
router.put('/:id', authenticateToken, validatePageUpdate, pageController.updatePage);

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     summary: Delete page (Admin only)
 *     tags: [Page Management]
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
 *         description: Page deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 */
router.delete('/:id', authenticateToken, pageController.deletePage);

module.exports = router;