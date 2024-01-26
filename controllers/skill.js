const Skill = require("../models/Skill");

exports.getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.findAll();
    if (!skills.length) return res.sendStatus(204);
    res.status(200).send(skills);
  } catch (error) {
    next(error, req, res, next);
  }
};
