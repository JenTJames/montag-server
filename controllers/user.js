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
    return next(error, req, res, next);
  }
  const isEmailDuplicate = await this.checkDuplicateEmail(user.email);
  if (isEmailDuplicate || isEmailDuplicate instanceof Error) {
    const err = new Error();
    err.code = 400;
    err.message =
      isEmailDuplicate instanceof Error
        ? "Invalid Email"
        : "Another user with the same email is already registered";
    return next(err, req, res, next);
  }
  const isPhoneNumberDuplicate = await this.checkDuplicatePhoneNumber(
    user.phoneNumber
  );
  if (isPhoneNumberDuplicate || isPhoneNumberDuplicate instanceof Error) {
    const err = new Error();
    err.code = 400;
    err.message =
      isPhoneNumberDuplicate instanceof Error
        ? "Invalid Phone Number"
        : "Another user with the same phone number is already registered";
    return next(err, req, res, next);
  }
  const isRoleValid = await roleController.verifyRole(user.role.id);
  if (!isRoleValid || isRoleValid instanceof Error) {
    const err = new Error("Invalid Role");
    err.code = 400;
    return next(err, req, res, next);
  }
  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(user.password, salt);
  } catch (error) {
    error.message = "Something went wrong while hashing the password";
    return next(error, req, res, next);
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
    next(error, req, res, next);
  }
};

exports.checkDuplicateEmail = async (email) => {
  if (!email) {
    const error = new Error("Invalid Email");
    error.code = 400;
    return error;
  }
  try {
    const count = await User.count({
      where: {
        email,
      },
    });
    if (count) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};

exports.checkDuplicatePhoneNumber = async (phoneNumber) => {
  if (!phoneNumber) {
    const error = new Error("Invalid Phone number");
    error.code = 400;
    return error;
  }
  try {
    const count = await User.count({
      where: {
        phoneNumber,
      },
    });
    if (count) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};
