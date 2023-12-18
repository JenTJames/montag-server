const path = require("path");
const fs = require("fs");

const imageDirectory = path.join(__dirname, "../", "uploads");
const URI = `http://localhost:${process.env.PORT || 3001}/uploads`;

exports.getImage = (req, res, next) => {
  const { type, name } = req.query;
  if (!type || !name) {
    const err = new Error();
    err.code = 400;
    return next(err);
  }
  try {
    const imagePath = path.join(imageDirectory, type, name);
    if (fs.existsSync(imagePath)) {
      res.status(200).send(`${URI}/${type}/${name}`);
    } else {
      const err = new Error();
      err.code = 404;
      return next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
