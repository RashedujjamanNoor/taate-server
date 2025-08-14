// File: controllers/uploadController.js
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import { validationResult } from "express-validator";
import { Product } from "../models/Upload.js";

const cleanupFiles = (files) => {
  if (files && files.length > 0) {
    files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error cleaning up file:", file.path, err);
      });
    });
  }
};

export const handleUpload = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    cleanupFiles(req.files);
    return res
      .status(400)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  try {
    const { title, description, price, category } = req.body;

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      images: uploadedImages,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product uploaded successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    cleanupFiles(req.files);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
