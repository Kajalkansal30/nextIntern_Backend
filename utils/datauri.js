import DataUriParser from "datauri/parser.js";
import path from "path";

/**
 * Converts an uploaded file buffer to a Data URI format using its original extension.
 * @param {Object} file - The uploaded file object from Multer (e.g., req.file or req.files.image[0]).
 * @returns {Object} - A DataURI object containing the file's content as a base64 string.
 */
export const getDataUri = (file) => {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error("Invalid file input");
  }

  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString().toLowerCase();

  // Optionally: Validate supported extensions again here if needed

  return parser.format(extName, file.buffer);
};

