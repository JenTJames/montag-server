const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.get("", userController.getUser);

router.post("/", userController.createUser);
router.post("/authenticate", userController.authenticate);
router.post("/uploads", userController.uploadUserImage);

router.put("/", userController.updateUser);

module.exports = router;
