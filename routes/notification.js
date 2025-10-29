const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notificationStream,
  getConnectionStats,
  addNotificationEmail,
  getAllNotificationEmails,
  deleteNotificationEmail,
  testEmailConfiguration,
  sendCustomNotification
} = require('../controllers/notificationController');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Real-time notification management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Notification ID
 *           example: 1
 *         title:
 *           type: string
 *           description: Notification title
 *           example: "New Contact Inquiry"
 *         message:
 *           type: string
 *           description: Notification message
 *           example: "John Doe submitted a contact inquiry"
 *         route:
 *           type: string
 *           description: Source API route
 *           example: "/api/contact"
 *         targetRoute:
 *           type: string
 *           description: Frontend route to navigate
 *           example: "/admin/contact-responses"
 *         referenceId:
 *           type: integer
 *           description: Reference ID of the related entity
 *           example: 5
 *         type:
 *           type: string
 *           enum: [contact, consultant, community]
 *           description: Notification type
 *           example: "contact"
 *         isRead:
 *           type: boolean
 *           description: Read status
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2024-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications with pagination
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Get only unread notifications
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, getNotifications);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get count of unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/unread-count', authenticateToken, getUnreadCount);

/**
 * @swagger
 * /api/notifications/stream:
 *   get:
 *     summary: SSE stream for real-time notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SSE connection established
 *       401:
 *         description: Unauthorized
 */
router.get('/stream', authenticateToken, notificationStream);

/**
 * @swagger
 * /api/notifications/stats:
 *   get:
 *     summary: Get SSE connection statistics
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connection stats retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticateToken, getConnectionStats);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/read', authenticateToken, markAsRead);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch('/mark-all-read', authenticateToken, markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticateToken, deleteNotification);

// ==================== EMAIL NOTIFICATION MANAGEMENT ROUTES ====================

/**
 * @swagger
 * /api/notifications/emails:
 *   post:
 *     summary: Add notification email address
 *     tags: [Notifications]
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
 *                 description: Email address to add
 *                 example: admin@example.com
 *     responses:
 *       201:
 *         description: Notification email added successfully
 *       409:
 *         description: Email already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/emails', [
  authenticateToken,
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address')
], addNotificationEmail);

/**
 * @swagger
 * /api/notifications/emails:
 *   get:
 *     summary: Get all notification email addresses
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notification emails
 *       401:
 *         description: Unauthorized
 */
router.get('/emails', authenticateToken, getAllNotificationEmails);

/**
 * @swagger
 * /api/notifications/emails/{email}:
 *   delete:
 *     summary: Delete notification email address
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email address to delete
 *     responses:
 *       200:
 *         description: Notification email deleted successfully
 *       404:
 *         description: Email not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/emails/:email', authenticateToken, deleteNotificationEmail);

/**
 * @swagger
 * /api/notifications/test-email:
 *   post:
 *     summary: Test email configuration
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *       500:
 *         description: Email configuration error
 *       401:
 *         description: Unauthorized
 */
router.post('/test-email', authenticateToken, testEmailConfiguration);

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send custom notification to all notification emails
 *     tags: [Notifications]
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
 *                 description: Email subject
 *                 example: System Maintenance Alert
 *               message:
 *                 type: string
 *                 description: Email message
 *                 example: Scheduled maintenance will begin at 2:00 AM UTC
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: No notification emails configured
 *       401:
 *         description: Unauthorized
 */
router.post('/send', [
  authenticateToken,
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], sendCustomNotification);

module.exports = router;
