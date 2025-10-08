const { body } = require('express-validator');

// Registration validation
const validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user')
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Contact form validation
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
];

// Contact status update validation
const validateContactStatusUpdate = [
  body('status')
    .isIn(['new', 'read', 'replied', 'closed'])
    .withMessage('Status must be one of: new, read, replied, closed')
];

// Page creation validation
const validatePageCreation = [
  body('page')
    .trim()
    .notEmpty()
    .withMessage('Page name is required')
];

// Page update validation
const validatePageUpdate = [
  body('page')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Page name cannot be empty')
];

// Breadcrumb creation/update validation
const validateBreadcrumbCreation = [
  body('page')
    .trim()
    .notEmpty()
    .withMessage('Page name is required'),
  
  body('pageTitle')
    .trim()
    .notEmpty()
    .withMessage('Page title is required'),
  
  body('pageDescription')
    .trim()
    .notEmpty()
    .withMessage('Page description is required')
];

// Breadcrumb update validation
const validateBreadcrumbUpdate = [
  body('pageTitle')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Page title cannot be empty'),
  
  body('pageDescription')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Page description cannot be empty')
];

// Consultant request validation
const validateConsultantRequest = [
  body('ngoName')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('NGO name must be between 2 and 255 characters')
    .notEmpty()
    .withMessage('NGO name is required'),
  
  body('ngoRegistrationNumber')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Registration number must not exceed 100 characters'),
  
  body('chairmanPresidentName')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Chairman/President name must be between 2 and 255 characters')
    .notEmpty()
    .withMessage('Chairman/President name is required'),
  
  body('specializedAreas')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Specialized areas must be between 5 and 1000 characters')
    .notEmpty()
    .withMessage('Specialized areas are required'),
  
  body('planningToExpand')
    .isBoolean()
    .withMessage('Planning to expand must be a boolean value'),
  
  body('expansionRegions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Expansion regions must not exceed 500 characters'),
  
  body('needFundingSupport')
    .isBoolean()
    .withMessage('Need funding support must be a boolean value'),
  
  body('totalFundRequired')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Total fund required must be a valid decimal number'),
  
  body('lookingForFundManager')
    .isBoolean()
    .withMessage('Looking for fund manager must be a boolean value'),
  
  body('openToSplittingInvestment')
    .isBoolean()
    .withMessage('Open to splitting investment must be a boolean value'),
  
  body('hasSpecializedTeam')
    .isBoolean()
    .withMessage('Has specialized team must be a boolean value'),
  
  body('needAssistance')
    .optional()
    .isBoolean()
    .withMessage('Need assistance must be a boolean value'),
  
  body('emailAddress')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('websiteAddress')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('phoneNumber')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Phone number must be between 5 and 50 characters')
    .notEmpty()
    .withMessage('Phone number is required')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateContactForm,
  validateContactStatusUpdate,
  validatePageCreation,
  validatePageUpdate,
  validateBreadcrumbCreation,
  validateBreadcrumbUpdate,
  validateConsultantRequest
};
