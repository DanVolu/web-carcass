import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path for 'uploads' directory
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filenames
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only specific types of files
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

export default upload;
