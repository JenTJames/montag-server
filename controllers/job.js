const Job = require("../models/Job");
const sequelize = require("../utils/database");
const { getIds } = require("../utils/lib");
const perkController = require("./perk");

exports.createJob = async (req, res, next) => {
  if (!isJobValid(req.body)) {
    console.log("Here");
    const error = new Error();
    error.code = 400;
    return next(error, req, res, next);
  }

  const {
    title,
    description,
    keyResponsibilities,
    whyToJoin,
    employmentType,
    experienceLevel,
    workingSchedule,
    expiry,
    salaryFrequency,
    salary,
    jobFamilyId,
    perks,
    skills,
    locations,
    isJobVisaProvided,
    isSalaryNegotiable,
  } = req.body;

  const job = {
    title: title,
    description: description,
    responsibilities: keyResponsibilities,
    whyToJoin: whyToJoin,
    employmentType: employmentType,
    experienceLevel: experienceLevel,
    isJobVisaProvided: isJobVisaProvided,
    workingSchedule: workingSchedule,
    expiresOn: expiry,
    salaryFrequency: salaryFrequency,
    salary: salary,
    isSalaryNegotiable: isSalaryNegotiable,
  };
  const transaction = await sequelize.transaction();
  try {
    const savedJob = await Job.create(job, { transaction });

    //save the job family against the job
    await savedJob.setJobFamily(jobFamilyId, {
      transaction,
    });

    // save the posted by user against the job
    await savedJob.setPostedBy(postedBy, { transaction });

    // Gets all skill IDs from skills and saves it
    const skillIds = getIds(skills);
    await savedJob.addSkills(skillIds, { transaction });

    // perks are an object. Find all the perks having true as value, gets their IDs and saves them
    const selectedPerks = await perkController.findTruePerks(perks);
    const perkIds = getIds(selectedPerks);
    await savedJob.addPerks(perkIds, { transaction });

    // Get all location IDs from locations and saves it
    const locationIds = getIds(locations);
    await savedJob.addLocations(locationIds, { transaction });

    await transaction.commit();

    res.status(201).send(savedJob.id.toString());
  } catch (error) {
    await transaction.rollback();
    next(error, req, res, next);
  }
};

exports.findUserPostedJobs = async (userId) => {
  if (!userId) {
    const error = new Error("Invalid User ID");
    error.status = 400;
    return error;
  }
  try {
    const jobs = await Job.findAll({
      where: {
        postedBy: userId,
      },
    });
    return jobs;
  } catch (error) {
    error.status = 500;
    return error;
  }
};

const isJobValid = (job) => {
  const {
    title,
    description,
    keyResponsibilities,
    whyToJoin,
    employmentType,
    experienceLevel,
    workingSchedule,
    expiry,
    salaryFrequency,
    salary,
    jobFamilyId,
    perks,
    locations,
    skills,
    postedBy,
  } = job;
  if (
    !title ||
    !description ||
    !keyResponsibilities ||
    !whyToJoin ||
    !employmentType ||
    !experienceLevel ||
    !workingSchedule ||
    !expiry ||
    !salaryFrequency ||
    !salary ||
    !jobFamilyId ||
    !perks ||
    !locations ||
    !skills ||
    !postedBy
  )
    return false;
  return true;
};
