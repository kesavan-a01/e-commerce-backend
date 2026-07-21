const multer = require("multer");
const path = require("path");

// Vercel's serverless filesystem is read-only outside of /tmp, and /tmp
// doesn't persist between invocations anyway - so writing uploaded files to
// disk (the old approach) fails in production. Using memoryStorage keeps the
// file in RAM as a buffer instead; the controller then converts it to a
// Base64 data URI and stores it directly on the product document. This
// works identically in local dev and on Vercel with no extra setup.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    return cb(null, true);
  }
  cb(new Error("Only .jpeg, .jpg, .png and .webp image formats are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB - kept small since images are now stored as Base64 text in MongoDB
});

module.exports = upload;





// const multer = require("multer");
// const path = require("path");

// // NOTE: On Vercel's serverless filesystem, only /tmp is writable and files
// // do not persist between invocations. For production on Vercel, swap this
// // out for a cloud storage provider (Cloudinary, S3, etc.) — see README.
// // This local-disk version works fine for local development.
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "..", "uploads"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const extValid = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimeValid = allowedTypes.test(file.mimetype);

//   if (extValid && mimeValid) {
//     return cb(null, true);
//   }
//   cb(new Error("Only .jpeg, .jpg, .png and .webp image formats are allowed"));
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// module.exports = upload;
