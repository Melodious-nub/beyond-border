const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultantController');
const { authenticateToken } = require('../middleware/auth');
const { validateConsultantRequest } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Consultant Requests
 *   description: NGO Partnership & Funding Request Form - Find your Consultant
 */

/**
 * @swagger
 * /api/consultants:
 *   post:
 *     summary: Submit a consultant request (Public)
 *     tags: [Consultant Requests]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsultantRequest'
 *     responses:
 *       201:
 *         description: Consultant request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultantResponse'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', validateConsultantRequest, consultantController.createConsultantRequest);

/**
 * @swagger
 * /api/consultants:
 *   get:
 *     summary: Get all consultant requests with pagination (Admin only)
 *     tags: [Consultant Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Consultant requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultantListResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, consultantController.getAllConsultantRequests);

/**
 * @swagger
 * /api/consultants/{id}:
 *   get:
 *     summary: Get consultant request by ID (Admin only)
 *     tags: [Consultant Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Consultant request ID
 *     responses:
 *       200:
 *         description: Consultant request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultantResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Consultant request not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, consultantController.getConsultantRequestById);


/**
 * @swagger
 * /api/consultants/{id}:
 *   delete:
 *     summary: Delete consultant request (Admin only)
 *     tags: [Consultant Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Consultant request ID
 *     responses:
 *       200:
 *         description: Consultant request deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Consultant request not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, consultantController.deleteConsultantRequest);

module.exports = router;
