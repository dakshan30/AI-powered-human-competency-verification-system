const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Establish and verify target local storage path
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory/Disk storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Strict File Type filter checking MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF and Microsoft Word (.doc/.docx) documents are permitted."));
  }
};

// Initialize Multer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Intercept Multer single uploads to format error validations into structured JSON formats
const originalSingle = upload.single;
upload.single = function (fieldName) {
  const uploadMiddleware = originalSingle.call(upload, fieldName);
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              message: "File size exceeds the maximum limit of 5MB.",
              code: "FILE_TOO_LARGE"
            });
          }
          return res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`,
            code: "UPLOAD_ERROR"
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
          code: "INVALID_FILE"
        });
      }
      next();
    });
  };
};

module.exports = upload;