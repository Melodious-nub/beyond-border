const express = require('express');
const { ensureUploadDirectory, createMulterStorage, UPLOAD_DIRECTORIES } = require('../utils/uploadUtils');
const router = express.Router();

// Ensure upload directory exists and create multer configuration
const uploadDir = ensureUploadDirectory(UPLOAD_DIRECTORIES.AVATARS);
const upload = createMulterStorage(uploadDir, 'avatar', 500 * 1024); // 500KB limit

// Import controllers
const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  getAllActiveTeamMembers,
  getTeamStats
} = require('../controllers/teamController');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateTeamMemberCreation, validateTeamMemberUpdate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Team Management
 *   description: Team member management endpoints
 */

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team member (Admin only)
 *     tags: [Team Management]
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
 *               - email
 *               - designation
 *             properties:
 *               name:
 *                 type: string
 *                 description: Team member name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Team member email
 *                 example: john@example.com
 *               designation:
 *                 type: string
 *                 description: Team member designation
 *                 example: Senior Developer
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (max 500KB)
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Team member status
 *                 example: active
 *               isManagement:
 *                 type: boolean
 *                 description: Whether the member is in management
 *                 example: false
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number
 *                 example: +1-555-0123
 *               department:
 *                 type: string
 *                 description: Department
 *                 example: Engineering
 *               linkedinUrl:
 *                 type: string
 *                 description: LinkedIn URL
 *                 example: https://linkedin.com/in/johndoe
 *               facebookUrl:
 *                 type: string
 *                 description: Facebook URL
 *                 example: https://facebook.com/johndoe
 *               twitterUrl:
 *                 type: string
 *                 description: Twitter/X URL
 *                 example: https://twitter.com/johndoe
 *               instagramUrl:
 *                 type: string
 *                 description: Instagram URL
 *                 example: https://instagram.com/johndoe
 *               redditUrl:
 *                 type: string
 *                 description: Reddit URL
 *                 example: https://reddit.com/u/johndoe
 *               description:
 *                 type: string
 *                 description: Team member description
 *                 example: Experienced developer with 5+ years in web technologies
 *     responses:
 *       201:
 *         description: Team member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberResponse'
 *       400:
 *         description: Validation error
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
router.post('/', authenticateToken, requireRole(['admin']), upload.single('avatar'), validateTeamMemberCreation, createTeamMember);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all team members with pagination (Admin only)
 *     tags: [Team Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *       - in: query
 *         name: isManagement
 *         schema:
 *           type: boolean
 *         description: Filter by management status
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, email, or designation
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberListResponse'
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
router.get('/', authenticateToken, requireRole(['admin']), getAllTeamMembers);

/**
 * @swagger
 * /api/teams/stats:
 *   get:
 *     summary: Get team statistics (Admin only)
 *     tags: [Team Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamStatsResponse'
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
router.get('/stats', authenticateToken, requireRole(['admin']), getTeamStats);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get team member by ID (Admin only)
 *     tags: [Team Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberResponse'
 *       404:
 *         description: Team member not found
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
router.get('/:id', authenticateToken, requireRole(['admin']), getTeamMemberById);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update team member (Admin only)
 *     tags: [Team Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team member ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Team member name
 *                 example: John Updated Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Team member email
 *                 example: john.updated@example.com
 *               designation:
 *                 type: string
 *                 description: Team member designation
 *                 example: Lead Developer
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: New avatar image file (max 500KB)
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Team member status
 *                 example: active
 *               isManagement:
 *                 type: boolean
 *                 description: Whether the member is in management
 *                 example: true
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number
 *                 example: +1-555-0124
 *               department:
 *                 type: string
 *                 description: Department
 *                 example: Engineering
 *               linkedinUrl:
 *                 type: string
 *                 description: LinkedIn URL
 *                 example: https://linkedin.com/in/johndoe
 *               facebookUrl:
 *                 type: string
 *                 description: Facebook URL
 *                 example: https://facebook.com/johndoe
 *               twitterUrl:
 *                 type: string
 *                 description: Twitter/X URL
 *                 example: https://twitter.com/johndoe
 *               instagramUrl:
 *                 type: string
 *                 description: Instagram URL
 *                 example: https://instagram.com/johndoe
 *               redditUrl:
 *                 type: string
 *                 description: Reddit URL
 *                 example: https://reddit.com/u/johndoe
 *               description:
 *                 type: string
 *                 description: Team member description
 *                 example: Lead developer with 8+ years in web technologies
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Team member not found
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
router.put('/:id', authenticateToken, requireRole(['admin']), upload.single('avatar'), validateTeamMemberUpdate, updateTeamMember);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete team member (Admin only)
 *     tags: [Team Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member deleted successfully
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
 *                   example: Team member deleted successfully
 *       404:
 *         description: Team member not found
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
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteTeamMember);

/**
 * @swagger
 * /api/teams/public/active:
 *   get:
 *     summary: Get all active team members (Public)
 *     tags: [Team Management]
 *     security: []
 *     responses:
 *       200:
 *         description: Active team members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberPublicListResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/public/active', getAllActiveTeamMembers);


module.exports = router;
