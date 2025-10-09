const express = require('express');
const { body } = require('express-validator');
const { submitConsultantCommunity, getAllConsultantCommunities } = require('../controllers/consultantCommunityController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Consultant Community
 *   description: Consultant Community Membership Management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ConsultantCommunity:
 *       type: object
 *       required:
 *         - name
 *         - emailAddress
 *         - phoneNumber
 *         - company
 *         - designation
 *         - yearsOfExperience
 *         - areasOfExpertise
 *         - whyJoinCommunity
 *         - howCanContribute
 *         - email
 *         - whatsapp
 *         - slack
 *         - openToMentoring
 *         - agreement
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the consultant community membership
 *           example: 1
 *         name:
 *           type: string
 *           description: Full name of the applicant
 *           minLength: 2
 *           maxLength: 100
 *           example: "John Doe"
 *         emailAddress:
 *           type: string
 *           format: email
 *           description: Email address of the applicant
 *           example: "john.doe@example.com"
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the applicant
 *           minLength: 10
 *           maxLength: 20
 *           example: "+1234567890"
 *         linkedInProfile:
 *           type: string
 *           format: uri
 *           description: LinkedIn profile URL (optional)
 *           example: "https://linkedin.com/in/johndoe"
 *         company:
 *           type: string
 *           description: Company name where the applicant works
 *           minLength: 2
 *           maxLength: 100
 *           example: "Tech Solutions Inc."
 *         designation:
 *           type: string
 *           description: Job title or designation
 *           minLength: 2
 *           maxLength: 100
 *           example: "Senior Software Engineer"
 *         yearsOfExperience:
 *           type: integer
 *           description: Years of professional experience
 *           minimum: 0
 *           maximum: 50
 *           example: 8
 *         areasOfExpertise:
 *           type: array
 *           description: Areas of expertise (array of strings)
 *           items:
 *             type: string
 *             minLength: 2
 *             maxLength: 50
 *           example: ["Software Development", "Project Management", "Team Leadership"]
 *         whyJoinCommunity:
 *           type: string
 *           description: Reason for wanting to join the community
 *           minLength: 10
 *           maxLength: 1000
 *           example: "I want to join this community to share my expertise and learn from other professionals."
 *         howCanContribute:
 *           type: string
 *           description: How the applicant can contribute to the community
 *           minLength: 10
 *           maxLength: 1000
 *           example: "I can contribute by mentoring junior developers and sharing best practices."
 *         email:
 *           type: boolean
 *           description: Email notification preference
 *           example: true
 *         whatsapp:
 *           type: boolean
 *           description: WhatsApp communication preference
 *           example: true
 *         slack:
 *           type: boolean
 *           description: Slack communication preference
 *           example: false
 *         openToMentoring:
 *           type: boolean
 *           description: Willingness to mentor others
 *           example: true
 *         agreement:
 *           type: boolean
 *           description: Agreement to terms and conditions (must be true)
 *           example: true
 *         status:
 *           type: string
 *           description: Application status
 *           enum: [new, reviewed, approved, rejected]
 *           example: "new"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *     
 *     ConsultantCommunitySubmission:
 *       type: object
 *       required:
 *         - name
 *         - emailAddress
 *         - phoneNumber
 *         - company
 *         - designation
 *         - yearsOfExperience
 *         - areasOfExpertise
 *         - whyJoinCommunity
 *         - howCanContribute
 *         - email
 *         - whatsapp
 *         - slack
 *         - openToMentoring
 *         - agreement
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "John Doe"
 *         emailAddress:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 20
 *           example: "+1234567890"
 *         linkedInProfile:
 *           type: string
 *           format: uri
 *           example: "https://linkedin.com/in/johndoe"
 *         company:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Tech Solutions Inc."
 *         designation:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Senior Software Engineer"
 *         yearsOfExperience:
 *           type: integer
 *           minimum: 0
 *           maximum: 50
 *           example: 8
 *         areasOfExpertise:
 *           type: array
 *           items:
 *             type: string
 *             minLength: 2
 *             maxLength: 50
 *           example: ["Software Development", "Project Management", "Team Leadership"]
 *         whyJoinCommunity:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           example: "I want to join this community to share my expertise and learn from other professionals."
 *         howCanContribute:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           example: "I can contribute by mentoring junior developers and sharing best practices."
 *         email:
 *           type: boolean
 *           example: true
 *         whatsapp:
 *           type: boolean
 *           example: true
 *         slack:
 *           type: boolean
 *           example: false
 *         openToMentoring:
 *           type: boolean
 *           example: true
 *         agreement:
 *           type: boolean
 *           example: true
 *     
 *     ConsultantCommunityResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Your consultant community membership application has been submitted successfully. We will review and get back to you soon!"
 *         data:
 *           type: object
 *           properties:
 *             consultantCommunity:
 *               $ref: '#/components/schemas/ConsultantCommunity'
 *     
 *     ConsultantCommunityListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Consultant community memberships retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             consultantCommunities:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConsultantCommunity'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 pages:
 *                   type: integer
 *                   example: 3
 *     
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "name"
 *               message:
 *                 type: string
 *                 example: "Name is required"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Failed to submit your application. Please try again later."
 */

// Validation rules for consultant community form
const consultantCommunityValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('emailAddress')
    .isEmail()
    .withMessage('Valid email address is required')
    .normalizeEmail(),
  
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  
  body('linkedInProfile')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('LinkedIn profile must be a valid URL'),
  
  body('company')
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company must be between 2 and 100 characters'),
  
  body('designation')
    .notEmpty()
    .withMessage('Designation/Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Designation must be between 2 and 100 characters'),
  
  body('yearsOfExperience')
    .notEmpty()
    .withMessage('Years of experience is required')
    .isInt({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50'),
  
  body('areasOfExpertise')
    .isArray({ min: 1 })
    .withMessage('At least one area of expertise must be selected'),
  
  body('areasOfExpertise.*')
    .notEmpty()
    .withMessage('Area of expertise cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Each area of expertise must be between 2 and 50 characters'),
  
  body('whyJoinCommunity')
    .notEmpty()
    .withMessage('Why do you want to join this community is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Response must be between 10 and 1000 characters'),
  
  body('howCanContribute')
    .notEmpty()
    .withMessage('How can you contribute to the community is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Response must be between 10 and 1000 characters'),
  
  body('email')
    .isBoolean()
    .withMessage('Email preference must be true or false'),
  
  body('whatsapp')
    .isBoolean()
    .withMessage('WhatsApp preference must be true or false'),
  
  body('slack')
    .isBoolean()
    .withMessage('Slack preference must be true or false'),
  
  body('openToMentoring')
    .isBoolean()
    .withMessage('Open to mentoring must be true or false'),
  
  body('agreement')
    .equals('true')
    .withMessage('You must agree to the terms and conditions')
];

/**
 * @swagger
 * /api/consultant-community/submit:
 *   post:
 *     summary: Submit Consultant Community Membership Application
 *     description: Submit a new consultant community membership application. This is a public endpoint that allows professionals to apply for community membership.
 *     tags: [Consultant Community]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsultantCommunitySubmission'
 *           examples:
 *             complete_application:
 *               summary: Complete Application Example
 *               value:
 *                 name: "John Doe"
 *                 emailAddress: "john.doe@example.com"
 *                 phoneNumber: "+1234567890"
 *                 linkedInProfile: "https://linkedin.com/in/johndoe"
 *                 company: "Tech Solutions Inc."
 *                 designation: "Senior Software Engineer"
 *                 yearsOfExperience: 8
 *                 areasOfExpertise: ["Software Development", "Project Management", "Team Leadership"]
 *                 whyJoinCommunity: "I want to join this community to share my expertise and learn from other professionals in the field. I believe in collaborative growth and helping others succeed."
 *                 howCanContribute: "I can contribute by mentoring junior developers, sharing best practices, and participating in community discussions. I have extensive experience in agile methodologies and can help with project management guidance."
 *                 email: true
 *                 whatsapp: true
 *                 slack: false
 *                 openToMentoring: true
 *                 agreement: true
 *             minimal_application:
 *               summary: Minimal Application Example
 *               value:
 *                 name: "Jane Smith"
 *                 emailAddress: "jane.smith@example.com"
 *                 phoneNumber: "+1987654321"
 *                 company: "Innovation Corp"
 *                 designation: "Product Manager"
 *                 yearsOfExperience: 5
 *                 areasOfExpertise: ["Product Management", "User Experience"]
 *                 whyJoinCommunity: "I am passionate about product innovation and want to connect with like-minded professionals to share insights and best practices."
 *                 howCanContribute: "I can share my experience in product strategy, user research methodologies, and cross-functional team collaboration."
 *                 email: true
 *                 whatsapp: false
 *                 slack: true
 *                 openToMentoring: false
 *                 agreement: true
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultantCommunityResponse'
 *             examples:
 *               success_response:
 *                 summary: Successful Submission
 *                 value:
 *                   success: true
 *                   message: "Your consultant community membership application has been submitted successfully. We will review and get back to you soon!"
 *                   data:
 *                     consultantCommunity:
 *                       id: 1
 *                       name: "John Doe"
 *                       emailAddress: "john.doe@example.com"
 *                       phoneNumber: "+1234567890"
 *                       linkedInProfile: "https://linkedin.com/in/johndoe"
 *                       company: "Tech Solutions Inc."
 *                       designation: "Senior Software Engineer"
 *                       yearsOfExperience: 8
 *                       areasOfExpertise: ["Software Development", "Project Management", "Team Leadership"]
 *                       whyJoinCommunity: "I want to join this community to share my expertise and learn from other professionals."
 *                       howCanContribute: "I can contribute by mentoring junior developers and sharing best practices."
 *                       email: true
 *                       whatsapp: true
 *                       slack: false
 *                       openToMentoring: true
 *                       agreement: true
 *                       status: "new"
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                       updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               validation_error:
 *                 summary: Validation Error Example
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "name"
 *                       message: "Name is required"
 *                     - field: "emailAddress"
 *                       message: "Valid email address is required"
 *                     - field: "agreement"
 *                       message: "You must agree to the terms and conditions"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Server Error Example
 *                 value:
 *                   success: false
 *                   message: "Failed to submit your application. Please try again later."
 */
router.post('/submit', consultantCommunityValidation, submitConsultantCommunity);

/**
 * @swagger
 * /api/consultant-community/admin:
 *   get:
 *     summary: Get All Consultant Community Memberships (Admin)
 *     description: Retrieve all consultant community membership applications with pagination. This endpoint requires admin authentication.
 *     tags: [Consultant Community]
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
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Consultant community memberships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultantCommunityListResponse'
 *             examples:
 *               success_response:
 *                 summary: Successful Retrieval
 *                 value:
 *                   success: true
 *                   message: "Consultant community memberships retrieved successfully"
 *                   data:
 *                     consultantCommunities:
 *                       - id: 1
 *                         name: "John Doe"
 *                         emailAddress: "john.doe@example.com"
 *                         phoneNumber: "+1234567890"
 *                         linkedInProfile: "https://linkedin.com/in/johndoe"
 *                         company: "Tech Solutions Inc."
 *                         designation: "Senior Software Engineer"
 *                         yearsOfExperience: 8
 *                         areasOfExpertise: ["Software Development", "Project Management", "Team Leadership"]
 *                         whyJoinCommunity: "I want to join this community to share my expertise and learn from other professionals."
 *                         howCanContribute: "I can contribute by mentoring junior developers and sharing best practices."
 *                         email: true
 *                         whatsapp: true
 *                         slack: false
 *                         openToMentoring: true
 *                         agreement: true
 *                         status: "new"
 *                         createdAt: "2024-01-15T10:30:00.000Z"
 *                         updatedAt: "2024-01-15T10:30:00.000Z"
 *                       - id: 2
 *                         name: "Jane Smith"
 *                         emailAddress: "jane.smith@example.com"
 *                         phoneNumber: "+1987654321"
 *                         company: "Innovation Corp"
 *                         designation: "Product Manager"
 *                         yearsOfExperience: 5
 *                         areasOfExpertise: ["Product Management", "User Experience"]
 *                         whyJoinCommunity: "I am passionate about product innovation and want to connect with like-minded professionals."
 *                         howCanContribute: "I can share my experience in product strategy and user research methodologies."
 *                         email: true
 *                         whatsapp: false
 *                         slack: true
 *                         openToMentoring: false
 *                         agreement: true
 *                         status: "new"
 *                         createdAt: "2024-01-15T11:45:00.000Z"
 *                         updatedAt: "2024-01-15T11:45:00.000Z"
 *                     pagination:
 *                       page: 1
 *                       pageSize: 10
 *                       total: 2
 *                       pages: 1
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access denied. No token provided."
 *             examples:
 *               unauthorized:
 *                 summary: Unauthorized Access
 *                 value:
 *                   success: false
 *                   message: "Access denied. No token provided."
 *       403:
 *         description: Forbidden - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access denied. Invalid token."
 *             examples:
 *               forbidden:
 *                 summary: Invalid Token
 *                 value:
 *                   success: false
 *                   message: "Access denied. Invalid token."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Server Error Example
 *                 value:
 *                   success: false
 *                   message: "Failed to retrieve consultant community memberships"
 */
router.get('/admin', authenticateToken, getAllConsultantCommunities);

module.exports = router;
