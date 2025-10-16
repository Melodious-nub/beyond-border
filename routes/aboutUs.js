const express = require('express');
const { ensureUploadDirectory, createMulterStorage, UPLOAD_DIRECTORIES } = require('../utils/uploadUtils');
const { authenticateToken } = require('../middleware/auth');
const { validateAboutUsCreation } = require('../middleware/validation');
const {
  createOrUpdateAboutUs,
  getAboutUs,
  getAboutUsPublic
} = require('../controllers/aboutUsController');

const router = express.Router();

// Ensure upload directory exists and create multer configuration
const uploadDir = ensureUploadDirectory(UPLOAD_DIRECTORIES.ABOUT_US);
const upload = createMulterStorage(uploadDir, 'about-us');

/**
 * @swagger
 * tags:
 *   name: About Us
 *   description: About Us management endpoints
 */

/**
 * @swagger
 * /api/about-us:
 *   post:
 *     summary: Create or update about us content (Admin only)
 *     tags: [About Us]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 description: About us description content
 *                 example: "Beyond Border Consultants is a multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file (JPEG, JPG, PNG, GIF, WebP)
 *     responses:
 *       201:
 *         description: About us content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutUsResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
router.post('/', authenticateToken, upload.single('image'), validateAboutUsCreation, createOrUpdateAboutUs);

/**
 * @swagger
 * /api/about-us:
 *   get:
 *     summary: Get about us content (Admin only)
 *     tags: [About Us]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: About us content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutUsResponse'
 *       404:
 *         description: About us content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
router.get('/', authenticateToken, getAboutUs);

/**
 * @swagger
 * /api/about-us/public:
 *   get:
 *     summary: Get about us content (Public)
 *     tags: [About Us]
 *     security: []
 *     responses:
 *       200:
 *         description: About us content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutUsResponse'
 *       404:
 *         description: About us content not found
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
router.get('/public', getAboutUsPublic);

module.exports = router;
