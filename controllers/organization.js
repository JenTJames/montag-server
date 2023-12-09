const Organization = require("../models/Organization");

//Fetches all organizations
exports.getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.findAll();
    res.status(200).send(organizations);
  } catch (error) {
    next(error, req, res, next);
  }
};

// Handles upload for organization
exports.uploadHandler = async (req, res, next) => {
  const { id } = req.query;
  const file = req.file;
  if (!file) {
    res.status(200).send("No file received");
    return;
  }
  try {
    const organization = await Organization.findByPk(id);
    if (!organization) {
      const error = new Error(
        "Could not locate the organization with the given ID"
      );
      error.code = 400;
      return next(error, req, res, next);
    }
    organization.image = file.filename;
    organization.save();
    res.sendStatus(200);
  } catch (error) {
    next(error, req, res, next);
  }
};
