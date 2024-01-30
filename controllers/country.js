const Country = require("../models/Country");

exports.findCountries = async (req, res, next) => {
  try {
    const countries = await Country.findAll();
    res.status(200).send(countries);
  } catch (error) {
    next(error, req, res, next);
  }
};
