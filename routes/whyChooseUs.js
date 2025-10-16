const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { validateWhyChooseUsCreation, validateWhyChooseUsUpdate } = require('../middleware/validation');
const {
  createWhyChooseUs,
  getAllWhyChooseUs,
  getWhyChooseUsById,
  updateWhyChooseUs,
  deleteWhyChooseUs,
  getAllWhyChooseUsPublic
} = require('../controllers/whyChooseUsController');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/why-choose-us');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'why-choose-us-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'));
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: Why Choose Us
 *   description: Why Choose Us management endpoints
 */

/**
 * @swagger
 * /api/why-choose-us:
 *   post:
 *     summary: Create a new why choose us item (Admin only)
 *     tags: [Why Choose Us]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - details
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the why choose us item
 *                 example: "Expert Team"
 *               details:
 *                 type: string
 *                 description: Details/description of the why choose us item
 *                 example: "Our team consists of experienced professionals with years of expertise in their respective fields."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file (JPEG, JPG, PNG, GIF, WebP)
 *     responses:
 *       201:
 *         description: Why choose us item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WhyChooseUsResponse'
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
router.post('/', authenticateToken, upload.single('image'), validateWhyChooseUsCreation, createWhyChooseUs);

/**
 * @swagger
 * /api/why-choose-us:
 *   get:
 *     summary: Get all why choose us items with pagination (Admin only)
 *     tags: [Why Choose Us]
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
 *         description: Why choose us items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WhyChooseUsListResponse'
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
router.get('/', authenticateToken, getAllWhyChooseUs);

/**
 * @swagger
 * /api/why-choose-us/{id}:
 *   get:
 *     summary: Get why choose us item by ID (Admin only)
 *     tags: [Why Choose Us]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Why choose us item ID
 *     responses:
 *       200:
 *         description: Why choose us item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WhyChooseUsResponse'
 *       404:
 *         description: Why choose us item not found
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
router.get('/:id', authenticateToken, getWhyChooseUsById);

/**
 * @swagger
 * /api/why-choose-us/{id}:
 *   put:
 *     summary: Update why choose us item (Admin only)
 *     tags: [Why Choose Us]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Why choose us item ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - details
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the why choose us item
 *                 example: "Expert Team"
 *               details:
 *                 type: string
 *                 description: Details/description of the why choose us item
 *                 example: "Our team consists of experienced professionals with years of expertise in their respective fields."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file (JPEG, JPG, PNG, GIF, WebP)
 *     responses:
 *       200:
 *         description: Why choose us item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WhyChooseUsResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Why choose us item not found
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
router.put('/:id', authenticateToken, upload.single('image'), validateWhyChooseUsUpdate, updateWhyChooseUs);

/**
 * @swagger
 * /api/why-choose-us/{id}:
 *   delete:
 *     summary: Delete why choose us item (Admin only)
 *     tags: [Why Choose Us]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Why choose us item ID
 *     responses:
 *       200:
 *         description: Why choose us item deleted successfully
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
 *                   example: "Why choose us item deleted successfully"
 *       404:
 *         description: Why choose us item not found
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
router.delete('/:id', authenticateToken, deleteWhyChooseUs);

/**
 * @swagger
 * /api/why-choose-us/public/all:
 *   get:
 *     summary: Get all why choose us items (Public)
 *     tags: [Why Choose Us]
 *     security: []
 *     responses:
 *       200:
 *         description: Why choose us items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WhyChooseUsPublicListResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/public/all', getAllWhyChooseUsPublic);

module.exports = router;
