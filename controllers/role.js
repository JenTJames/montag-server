const Role = require("../models/Role");

exports.findAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    if (!roles || !roles.length) return res.sendStatus(204);
    res.status(200).send(roles);
  } catch (error) {
    next(error, req, res);
  }
};
