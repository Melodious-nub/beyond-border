const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Notification Management
 *   description: Notification email management system for receiving alerts from various forms and system events
 */

/**
 * @swagger
 * /api/notifications/emails:
 *   post:
 *     summary: Add notification email (Admin only)
 *     description: Add an email address to receive notifications from contact forms, system events, and other automated processes
 *     tags: [Notification Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to receive notifications
 *                 example: "admin@example.com"
 *     responses:
 *       201:
 *         description: Notification email added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationEmailResponse'
 *             example:
 *               success: true
 *               message: "Notification email added successfully"
 *               data:
 *                 notificationEmail:
 *                   id: 1
 *                   email: "admin@example.com"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already exists
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
router.post('/emails', authenticateToken, notificationController.addNotificationEmail);

/**
 * @swagger
 * /api/notifications/emails:
 *   get:
 *     summary: List all notification emails (Admin only)
 *     description: Retrieve all email addresses configured to receive notifications
 *     tags: [Notification Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification emails retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationEmailListResponse'
 *             example:
 *               success: true
 *               message: "Notification emails retrieved successfully"
 *               data:
 *                 notificationEmails:
 *                   - id: 1
 *                     email: "admin@example.com"
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                   - id: 2
 *                     email: "support@example.com"
 *                     createdAt: "2024-01-01T01:00:00.000Z"
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
router.get('/emails', authenticateToken, notificationController.listNotificationEmails);

/**
 * @swagger
 * /api/notifications/emails/{email}:
 *   delete:
 *     summary: Delete notification email (Admin only)
 *     description: Remove an email address from the notification list
 *     tags: [Notification Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address to remove from notifications
 *         example: "admin@example.com"
 *     responses:
 *       200:
 *         description: Notification email deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notification email deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notification email not found
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
router.delete('/emails/:email', authenticateToken, notificationController.deleteNotificationEmail);

/**
 * @swagger
 * /api/notifications/test-email:
 *   post:
 *     summary: Test email configuration (Admin only)
 *     description: Send a test email to verify email service configuration and notification delivery
 *     tags: [Notification Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTestResponse'
 *             example:
 *               success: true
 *               message: "Test email sent successfully"
 *               data:
 *                 messageId: "<test-message-id@example.com>"
 *       400:
 *         description: Email configuration error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.post('/test-email', authenticateToken, notificationController.testEmailConfiguration);

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send notification to all configured emails (Admin only)
 *     description: Send a custom notification message to all configured notification emails
 *     tags: [Notification Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Email subject line
 *                 example: "System Alert"
 *                 minLength: 1
 *                 maxLength: 200
 *               message:
 *                 type: string
 *                 description: Email message content
 *                 example: "This is a system notification message."
 *                 minLength: 1
 *                 maxLength: 2000
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notification sent to 3 email addresses"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sentCount:
 *                       type: integer
 *                       example: 3
 *                     failedCount:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.post('/send', authenticateToken, notificationController.sendNotification);

module.exports = router;
