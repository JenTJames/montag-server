const JobFamily = require("../models/JobFamily");

exports.getJobFamilies = async (req, res, next) => {
  try {
    const jobFamilies = await JobFamily.findAll();
    if (!jobFamilies || !jobFamilies.length) return res.sendStatus(204);
    res.status(200).send(jobFamilies);
  } catch (error) {
    next(error, req, res, next);
  }
};
