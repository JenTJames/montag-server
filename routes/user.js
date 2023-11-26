const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/", userController.createUser);
router.post("/authenticate", userController.authenticate);

module.exports = router;
