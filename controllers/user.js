const bcrypt = require("bcrypt");

const User = require("../models/User");
const roleController = require("../controllers/role");

exports.getUser = async (req, res, next) => {
  const { organization } = req.query;
  const { email } = req.query;
  if (!email) {
    const error = new Error();
    error.code = 400;
    return next(error, req, res, next);
  }
  const user = await this.getUserByEmail(email, organization);
  if (!user || user instanceof Error) {
    const error = new Error("Could not find the user");
    error.code = 400;
    return next(error, req, res, next);
  }
  res.status(200).send(user);
};

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
    roleId: user.role.id,
  };
  try {
    const savedUser = await User.create(newUser);
    res.status(201).send(savedUser.id.toString());
  } catch (error) {
    next(error, req, res, next);
  }
};

exports.updateUser = async (req, res, next) => {
  const user = req.body;

  if (!user || !user.id) {
    const error = new Error();
    error.code = 400;
    return next(error, req, res, next);
  }

  try {
    const numberOfUsersUpdated = await User.update(user, {
      where: {
        id: user.id,
      },
    });
    if (!numberOfUsersUpdated) {
      const error = new Error("Could not edit the user");
      return next(error, req, res, next);
    }
    res.status(200).send(user);
  } catch (error) {
    next(error, req, res, next);
  }
};

exports.authenticate = async (req, res, next) => {
  const credentials = req.body;
  if (!credentials || !credentials.identifier || !credentials.password) {
    const error = new Error();
    error.code = 400;
    return next(error, req, res, next);
  }
  const numericRegex = /^[0-9]+$/;
  let user = null;
  try {
    if (numericRegex.test(credentials.identifier)) {
      user = await User.findOne({
        where: {
          phoneNumber: credentials.identifier,
        },
      });
    } else
      user = await User.findOne({
        where: {
          email: credentials.identifier,
        },
      });
    if (!user) {
      const error = new Error();
      error.code = 401;
      return next(error, req, res, next);
    }
    const isVerified = await bcrypt.compare(
      credentials.password,
      user.password
    );
    user.password = undefined;
    if (isVerified) return res.status(200).send(user);
    return res.sendStatus(401);
  } catch (error) {
    next(error, req, res, next);
  }
};

exports.getUserByEmail = async (email, includeOrganization = false) => {
  if (!email) {
    const error = new Error("Invalid Email");
    error.code = 400;
    return error;
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    let organization = null;

    if (includeOrganization) {
      organization = await user.getOrganization();
    }

    return user
      ? {
          ...user.dataValues,
          password: undefined,
          organizationId: undefined,
          organization: organization || undefined,
        }
      : null;
  } catch (error) {
    return error;
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
