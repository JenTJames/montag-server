module.exports = (error, _, res, next) => {
  console.log(error);
  let message = "Internal Server Error";
  switch (error.code) {
    // Missing Attributes
    case 400:
      message =
        error.message ||
        "Either all or some of the required attributes are missing";
      break;

    default:
      message = error.message || "Internal Server Error";
      break;
  }
  return res.status(400).send(message);
};
