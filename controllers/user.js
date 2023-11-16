const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res, next) => {
  const user = req.body;
  if (
    !user ||
    !user.firstname ||
    !user.lastname ||
    !user.email ||
    !user.password ||
    !user.phoneNumber
  ) {
    const error = new Error();
    error.code = 400;
    return next(error, req, res);
  }
  let hashedPassword;
  try {
    const salt = bcrypt.genSalt(12);
    hashedPassword = bcrypt.hash(user.password, salt);
  } catch (error) {
    error.message = "Something went wrong while hashing the password";
    return next(error, req, res);
  }
  const newUser = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: hashedPassword,
    phoneNumber: user.phoneNumber,
  };
  try {
    const savedUser = await User.create(newUser);
    res.status(201).send(savedUser.id);
  } catch (error) {
    next(error, req, res);
  }
};
