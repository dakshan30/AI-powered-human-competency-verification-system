const multer =
  require("multer");

const path =
  require("path");

/*
====================================
STORAGE
====================================
*/

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        "uploads/"
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        `${Date.now()}-${file.originalname}`
      );
    },
  });

/*
====================================
FILE FILTER
====================================
*/

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    ".pdf",
    ".docx",
  ];

  const ext =
    path.extname(
      file.originalname
    );

  if (
    allowedTypes.includes(
      ext
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF and DOCX files are allowed"
      )
    );
  }
};

/*
====================================
UPLOAD
====================================
*/

const upload = multer({
  storage,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;