const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/", userController.createUser);

module.exports = router;
