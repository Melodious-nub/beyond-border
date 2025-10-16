const express = require('express');
const { ensureUploadDirectory, createMulterStorage, UPLOAD_DIRECTORIES } = require('../utils/uploadUtils');
const { authenticateToken } = require('../middleware/auth');
const { validateTestimonialCreation, validateTestimonialUpdate } = require('../middleware/validation');
const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonialsPublic
} = require('../controllers/testimonialController');

const router = express.Router();

// Ensure upload directory exists and create multer configuration
const uploadDir = ensureUploadDirectory(UPLOAD_DIRECTORIES.TESTIMONIALS);
const upload = createMulterStorage(uploadDir, 'testimonial');

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Testimonials management endpoints
 */

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Create a new testimonial (Admin only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person giving testimonial
 *                 example: "John Doe"
 *               department:
 *                 type: string
 *                 description: Department of the person (optional)
 *                 example: "Engineering"
 *               designation:
 *                 type: string
 *                 description: Designation of the person (optional)
 *                 example: "Senior Developer"
 *               description:
 *                 type: string
 *                 description: Testimonial description/content
 *                 example: "This company has provided excellent service and support throughout our project."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file (JPEG, JPG, PNG, GIF, WebP)
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestimonialResponse'
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
router.post('/', authenticateToken, upload.single('image'), validateTestimonialCreation, createTestimonial);

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials with pagination (Admin only)
 *     tags: [Testimonials]
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
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestimonialListResponse'
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
router.get('/', authenticateToken, getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get testimonial by ID (Admin only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestimonialResponse'
 *       404:
 *         description: Testimonial not found
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
router.get('/:id', authenticateToken, getTestimonialById);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update testimonial (Admin only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person giving testimonial
 *                 example: "John Doe"
 *               department:
 *                 type: string
 *                 description: Department of the person (optional)
 *                 example: "Engineering"
 *               designation:
 *                 type: string
 *                 description: Designation of the person (optional)
 *                 example: "Senior Developer"
 *               description:
 *                 type: string
 *                 description: Testimonial description/content
 *                 example: "This company has provided excellent service and support throughout our project."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file (JPEG, JPG, PNG, GIF, WebP)
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestimonialResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Testimonial not found
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
router.put('/:id', authenticateToken, upload.single('image'), validateTestimonialUpdate, updateTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: Delete testimonial (Admin only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
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
 *                   example: "Testimonial deleted successfully"
 *       404:
 *         description: Testimonial not found
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
router.delete('/:id', authenticateToken, deleteTestimonial);

/**
 * @swagger
 * /api/testimonials/public/all:
 *   get:
 *     summary: Get all testimonials (Public)
 *     tags: [Testimonials]
 *     security: []
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestimonialPublicListResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/public/all', getAllTestimonialsPublic);

module.exports = router;
