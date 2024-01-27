const Skill = require("../models/Skill");

exports.getSkills = async (req, res, next) => {
  const { jobFamilyId } = req.query;
  try {
    const skills = jobFamilyId
      ? await Skill.findAll({
          where: {
            jobFamilyId,
          },
        })
      : await Skill.findAll();
    res.status(200).send(skills);
  } catch (error) {
    next(error, req, res, next);
  }
};
