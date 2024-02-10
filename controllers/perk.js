const Perk = require("../models/Perk");
const { convertCamelCaseToSentence } = require("../utils/lib");

exports.findPerks = async (req, res, next) => {
  try {
    const perks = await Perk.findAll();
    res.status(200).send(perks);
  } catch (error) {
    next(error, req, res, next);
  }
};

exports.findTruePerks = async (perksObject) => {
  const perks = [];
  await Promise.all(
    Object.keys(perksObject).map(async (perk) => {
      if (perksObject[perk]) {
        const perkName = convertCamelCaseToSentence(perk);
        const storedPerk = await findPerkByName(perkName);
        perks.push(storedPerk);
      }
    })
  );
  return perks;
};

// Private Methods
const findPerkByName = async (name) => {
  if (!name) {
    const error = new Error("Invalid name");
    error.status = 400;
    return error;
  }
  try {
    const perk = await Perk.findOne({
      where: {
        name,
      },
    });
    return perk.dataValues;
  } catch (error) {
    return error;
  }
};
