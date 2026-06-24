const cloudinary = require("cloudinary").v2;

/**
 * Configures Cloudinary using credentials from environment variables.
 * Used by uploadMiddleware.js to store event images in the cloud
 * instead of on the local server disk.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
