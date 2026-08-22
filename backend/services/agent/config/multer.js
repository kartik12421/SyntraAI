import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve("./temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir);
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const filterFile = (req, file, callback) => {
  if (
    file.mimetype == "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    callback(null, true);
  } else {
    callback(new Error("Only PDF and Image are allowed."));
  }
};

export default multer({
  storage,
  filterFile,
  limits: { fileSize: 20 * 1024 * 1024 },
});
