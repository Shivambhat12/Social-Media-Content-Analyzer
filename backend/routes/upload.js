import express from "express";
import multer from "multer";
import { handleText } from "../controllers/textController.js";
import { handleAnalyze } from "../controllers/analyzeController.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), handleText);
router.post("/analyze", upload.single("file"), handleAnalyze);

export default router;
