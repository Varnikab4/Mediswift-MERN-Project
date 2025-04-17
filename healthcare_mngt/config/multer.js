const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directory inside `server/uploads/`
const uploadPath = path.join(__dirname, "../server/uploads/");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadPath)) {
  console.log("Uploads directory does not exist. Creating...");
  fs.mkdirSync(uploadPath, { recursive: true });
} else {
  console.log("Uploads directory exists.");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Saving file to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now() + path.extname(file.originalname);
    console.log("Generated filename:", uniqueFilename);
    cb(null, uniqueFilename);
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("Received file:", file.originalname);
    const allowedTypes = /jpeg|jpg|png/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
      console.log("File is valid.");
      cb(null, true);
    } else {
      console.log("File is invalid:", file.mimetype);
      cb(new Error("Only JPEG, JPG, and PNG files are allowed!"));
    }
  }
});

module.exports = upload;
