const Country = require("../models/Country");
const Job = require("../models/Job");
const JobFamily = require("../models/JobFamily");
const Organization = require("../models/Organization");
const Perk = require("../models/Perk");
const Skill = require("../models/Skill");
const User = require("../models/User");
const sequelize = require("../utils/database");
const { getIds } = require("../utils/lib");
const perkController = require("./perk");

exports.createJob = async (req, res, next) => {
  if (!isJobValid(req.body)) {
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

exports.findJobById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const job = await Job.findByPk(userId, {
      include: [
        {
          model: JobFamily,
        },
        {
          model: User,
          as: "postedByUser",
          include: [
            {
              model: Organization,
            },
          ],
        },
        {
          model: Perk,
        },
        {
          model: Country,
          as: "locations",
        },
        {
          model: Skill,
        },
      ],
    });
    res.status(200).send(job);
  } catch (error) {
    next(error, req, res, next);
  }
};

exports.updateJob = async (req, res, next) => {
  if (!req.body.id || !isJobValid(req.body)) {
    const error = new Error();
    error.code = 400;
    return next(error, req, res, next);
  }
  const {
    id,
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
    id: id,
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

  const jobToUpdate = await Job.findByPk(job.id);

  if (!jobToUpdate) {
    const error = new Error();
    error.code = 400;
    return next(error, req, res, next);
  }

  jobToUpdate.title = job.title;
  jobToUpdate.description = job.description;
  jobToUpdate.responsibilities = job.responsibilities;
  jobToUpdate.whyToJoin = job.whyToJoin;
  jobToUpdate.employmentType = job.employmentType;
  jobToUpdate.experienceLevel = job.experienceLevel;
  jobToUpdate.isJobVisaProvided = job.isJobVisaProvided;
  jobToUpdate.workingSchedule = job.workingSchedule;
  jobToUpdate.expiresOn = job.expiry;
  jobToUpdate.salaryFrequency = job.salaryFrequency;
  jobToUpdate.salary = job.salary;
  jobToUpdate.isSalaryNegotiable = job.isSalaryNegotiable;
  jobToUpdate.postedBy = job.postedById;

  const transaction = await sequelize.transaction();
  try {
    const savedJob = await jobToUpdate.update(job, { transaction });

    //save the job family against the job
    await savedJob.setJobFamily(jobFamilyId, {
      transaction,
    });

    // Gets all skill IDs from skills and saves it
    const skillIds = getIds(skills);
    await savedJob.setSkills(skillIds, { transaction });

    // perks are an object. Find all the perks having true as value, gets their IDs and saves them
    const selectedPerks = await perkController.findTruePerks(perks);
    const perkIds = getIds(selectedPerks);
    await savedJob.setPerks(perkIds, { transaction });

    // Get all location IDs from locations and saves it
    const locationIds = getIds(locations);
    await savedJob.setLocations(locationIds, { transaction });

    await transaction.commit();

    res.status(200).send(savedJob.id.toString());
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
      include: [
        {
          model: User,
          as: "postedByUser",
          attributes: ["id", "firstname", "lastname", "email"],
          include: [
            {
              model: Organization,
              attributes: ["logo"],
            },
          ],
        },
      ],
    });
    return jobs;
  } catch (error) {
    console.log(error);
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
    postedById,
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
    !postedById
  )
    return false;
  return true;
};
