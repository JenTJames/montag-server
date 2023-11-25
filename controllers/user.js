const bcrypt = require("bcrypt");

const User = require("../models/User");
const roleController = require("../controllers/role");

exports.createUser = async (req, res, next) => {
  const user = req.body;
  if (
    !user ||
    !user.firstname ||
    !user.lastname ||
    !user.email ||
    !user.password ||
    !user.phoneNumber ||
    !user.role ||
    !user.role.id
  ) {
    const error = new Error();
    error.code = 400;
    return next(error, req, res);
  }
  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(user.password, salt);
  } catch (error) {
    error.message = "Something went wrong while hashing the password";
    return next(error, req, res);
  }
  const isRoleValid = await roleController.verifyRole(user.role.id);
  if (!isRoleValid || isRoleValid instanceof Error) {
    const err = new Error("Invalid Role");
    err.code = 400;
    return next(err, req, res);
  }
  const newUser = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: hashedPassword,
    phoneNumber: user.phoneNumber,
    roleId: user.id,
  };
  try {
    const savedUser = await User.create(newUser);
    res.status(201).send(savedUser.id);
  } catch (error) {
    next(error, req, res);
  }
};
