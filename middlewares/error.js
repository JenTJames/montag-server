module.exports = (error, _, res, next) => {
  console.log(error.message);
  console.log(error);
  let message = "Internal Server Error";
  switch (error.code) {
    // Missing Attributes
    case 400:
      message =
        error.message ||
        "Either all or some of the required attributes are missing";
      break;

    case 401:
      message = error.message || "Unauthorized";
      break;

    default:
      message = error.message || "Internal Server Error";
      break;
  }
  return res.status(error.code).send(message);
};
