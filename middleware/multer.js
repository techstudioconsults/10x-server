const multer = require("multer");
const path = require("path");

// Configure Multer to handle file uploads for multiple contents individually
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".mp4" &&
      ext !== ".mkv" &&
      ext !== ".jpeg" &&
      ext !== ".jpg" &&
      ext !== ".png"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
  debug: true,
}).single("file_url"); // 'file_url' is the name of the file input field for each content

module.exports = upload;
