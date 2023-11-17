const express = require("express");

const roleController = require("../controllers/role");

const router = express.Router();

router.get("", roleController.findAllRoles);

module.exports = router;
