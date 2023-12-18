const express = require("express");

const imageController = require("../controllers/image");

const router = express();

router.get("/", imageController.getImage);

module.exports = router;
