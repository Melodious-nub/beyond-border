const fs = require('fs');
const path = require('path');

/**
 * Ensures that the specified upload directory exists
 * @param {string} dirPath - The path to the upload directory
 * @returns {string} - The absolute path to the directory
 */
const ensureUploadDirectory = (dirPath) => {
  const fullPath = path.join(__dirname, '..', dirPath);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created upload directory: ${dirPath}`);
  }
  
  return fullPath;
};

/**
 * Creates multer storage configuration for file uploads
 * @param {string} uploadDir - The upload directory path
 * @param {string} filePrefix - The prefix for uploaded files
 * @param {number} fileSizeLimit - File size limit in bytes (default: 5MB)
 * @returns {Object} - Multer storage configuration
 */
const createMulterStorage = (uploadDir, filePrefix, fileSizeLimit = 5 * 1024 * 1024) => {
  const multer = require('multer');
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${filePrefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: fileSizeLimit
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
};

/**
 * Common upload directories used across the application
 */
const UPLOAD_DIRECTORIES = {
  AVATARS: 'uploads/avatars',
  TESTIMONIALS: 'uploads/testimonials',
  WHY_CHOOSE_US: 'uploads/why-choose-us',
  ABOUT_US: 'uploads/about-us'
};

/**
 * Ensures all common upload directories exist
 */
const ensureAllUploadDirectories = () => {
  Object.values(UPLOAD_DIRECTORIES).forEach(dir => {
    ensureUploadDirectory(dir);
  });
};

module.exports = {
  ensureUploadDirectory,
  createMulterStorage,
  UPLOAD_DIRECTORIES,
  ensureAllUploadDirectories
};
