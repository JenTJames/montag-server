const express = require("express");

const jobFamilyController = require("../controllers/jobFamily");

const router = express.Router();

router.get("", jobFamilyController.getJobFamilies);

module.exports = router;
