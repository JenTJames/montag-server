const express = require("express");

const PerkController = require("../controllers/perk");

const router = express.Router();

router.get("/", PerkController.findPerks);

module.exports = router;
