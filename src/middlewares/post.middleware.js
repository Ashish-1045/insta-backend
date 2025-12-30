// import multer from "multer";
// import mongoose from "mongoose";
// import { body, validationResult } from "express-validator";

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 },
// });

// export const handlefileUpload = upload.single("image");

// export const validateComment = [
//   body("post")
//     .notEmpty()
//     .withMessage("post is required")
//     .custom((postId) => mongoose.Types.ObjectId.isValid(postId))
//     .withMessage("Invalid post Id"),

//   body("text").notEmpty().withMessage("Text is required"),

//   body("parentComment")
//     .optional()
//     .custom((commentId) => mongoose.Types.ObjectId.isValid(commentId))
//     .withMessage("Invalid parent commentId"),

//   (req, res, next) => {
//     const err = validationResult(req);
//     if (!err.isEmpty()) {
//       return res.status(400).json({ errors: err.array() });
//     }
//     return next();
//   },
// ];

import multer from "multer";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

export const handlefileUpload = upload.single("image");

export const validateComment = [
  body("post")
    .notEmpty()
    .withMessage("post is required")
    .custom((postId) => mongoose.Types.ObjectId.isValid(postId))
    .withMessage("Invalid post Id"),

  body("text")
  .notEmpty()
  .withMessage("Text is required"),

  body("parentComment")
    .optional()
    .custom((commentId) => mongoose.Types.ObjectId.isValid(commentId))
    .withMessage("Invalid parent commentId"),

  (req, res, next) => {
    const err = validationResult(req);
    
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    return next();
  },
];
