const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');
const { validateContactForm } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form and notification email management
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form (Public)
 *     tags: [Contact]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactFormRequest'
 *           example:
 *             name: "John Doe"
 *             email: "john@example.com"
 *             description: "I would like to discuss a potential project with your team. Please contact me at your earliest convenience."
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *             example:
 *               success: true
 *               message: "Your message has been sent successfully. We will get back to you soon!"
 *               data:
 *                 contact:
 *                   id: 1
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   description: "I would like to discuss a potential project..."
 *                   status: "new"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateContactForm, contactController.submitContact);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Contact messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactListResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticateToken, contactController.getAllContacts);


module.exports = router;