const Perk = require("../models/Perk");

exports.findPerks = async (req, res, next) => {
  try {
    const perks = await Perk.findAll();
    res.status(200).send(perks);
  } catch (error) {
    next(error, req, res, next);
  }
};
