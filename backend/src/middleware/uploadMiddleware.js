const multer = require("multer");
const cloudinary = require("../config/cloudinary");

/**
 * uploadMiddleware.js
 * --------------------------------------------------
 * Handles event image uploads.
 *
 * Flow:
 *   1. Multer stores the uploaded file temporarily in memory.
 *   2. uploadToCloudinary() then pushes that file buffer to
 *      Cloudinary and attaches the resulting image URL to
 *      req.body.image so the controller/service can save it
 *      on the Event document.
 *
 * This keeps controllers free of any upload-specific code.
 */

// Store file in memory (not on disk) before sending it to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Middleware to actually push the buffered file to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
   console.log("FILE =>", req.file);
  try {
    if (!req.file) {
      // No image uploaded - that's fine, image is optional
      return next();
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "eventsphere/events",
    });

    req.imageUrl = result.secure_url;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload, // multer middleware -> use as upload.single("image")
  uploadToCloudinary,
};
