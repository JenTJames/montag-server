const express = require("express");

const organizationController = require("../controllers/organization");

const router = express.Router();

router.get("/", organizationController.getOrganizations);

router.post("/uploads", organizationController.uploadHandler);

module.exports = router;
