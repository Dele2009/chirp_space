const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
     destination: './public/uploads/',
     filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
     },
});

// Check file type (only allow images)
function checkFileType(file, cb) {
     const filetypes = /jpeg|jpg|png|gif/;
     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
     const mimetype = filetypes.test(file.mimetype);

     if (extname && mimetype) {
          return cb(null, true);
     } else {
          cb('Error: Images Only!');
     }
}

// Upload middleware
const upload = multer({
     storage,
     limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
     fileFilter: (req, file, cb) => {
          checkFileType(file, cb);
     },
});

module.exports = upload;
