const express = require("express");

const jobController = require("../controllers/job");

const router = express.Router();

router.post("/", jobController.createJob);

module.exports = router;
