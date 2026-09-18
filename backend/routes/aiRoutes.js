const express = require("express");
const multer = require("multer");
const aiController = require("../controllers/aiController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/resume/analyze", upload.single("resume"), aiController.analyzeResume);
router.post("/interview/evaluate", aiController.evaluateInterview);

module.exports = router;