const express = require("express");
const { getHealthcareNews } = require("../controllers/newsController");

const router = express.Router();

// ✅ Route to fetch latest healthcare news
router.get("/latest", getHealthcareNews);

module.exports = router;
