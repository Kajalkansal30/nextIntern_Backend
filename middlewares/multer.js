import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype;
  const field = file.fieldname;

  const pdfTypes = ['application/pdf'];
  const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/x-msvideo', 'video/webm', 'video/quicktime', 'video/x-flv', 'video/x-matroska', 'video/mpeg', 'video/3gpp', 'video/ogg'];
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (field === 'pdf') {
    return pdfTypes.includes(mimeType)
      ? cb(null, true)
      : cb(new Error('Only PDF files are allowed!'));
  }

  if (field === 'video') {
    return videoTypes.includes(mimeType)
      ? cb(null, true)
      : cb(new Error('Only video files are allowed!'));
  }

  if (field === 'image') {
    return imageTypes.includes(mimeType)
      ? cb(null, true)
      : cb(new Error('Only image files are allowed!'));
  }

  return cb(new Error('Invalid file field!'));
};

// Multer upload middleware for both fields
export const multipleUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 }, // Optional for image
]);
