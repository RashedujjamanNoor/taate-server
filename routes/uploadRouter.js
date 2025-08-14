// File: routes/uploadRoute.js
import { Router } from "express";
import upload from "../middleware/multer.js";
import { body } from "express-validator";
import { handleUpload } from "../controllers/uploadController.js";

const router = Router();

router.post(
  "/",
  upload.array("images", 4),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  handleUpload
);

export default router;
