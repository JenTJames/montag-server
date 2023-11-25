const Role = require("../models/Role");

exports.findAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    if (!roles || !roles.length) return res.sendStatus(204);
    res.status(200).send(roles);
  } catch (error) {
    next(error, req, res, next);
  }
};

exports.verifyRole = async (roleId) => {
  if (!roleId) return new Error("Invalid Role ID!");
  try {
    const numberOfRoles = await Role.count({
      where: {
        id: roleId,
      },
    });
    if (numberOfRoles === 0) return false;
    return true;
  } catch (error) {
    return error;
  }
};
