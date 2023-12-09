require("dotenv").config();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const errorHandler = require("./middlewares/error");
const userRoutes = require("./routes/user");
const roleRoutes = require("./routes/role");
const organizationRoutes = require("./routes/organization");

require("./models/assocations");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { saveType } = req.query;
    if (saveType) cb(null, `uploads/${saveType}`);
    else cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(req.query);
    const { name, id } = req.query;
    const imageExtension = file.originalname.split(".")[1];
    cb(null, id + "-" + name + "." + imageExtension);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
    return;
  }
  cb(null, false);
};

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single("image")
);

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/organizations", organizationRoutes);

app.use(errorHandler);

sequelize
  .sync({
    // alter: true,
    // force: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("App running on port " + process.env.PORT || 3001);
    });
  })
  .catch((error) => {
    console.log("Could not connect to the database.");
    console.log(error.message);
  });
