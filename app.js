require("dotenv").config();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const errorHandler = require("./middlewares/error");
const skillRoutes = require("./routes/skill");
const userRoutes = require("./routes/user");
const roleRoutes = require("./routes/role");
const jobFamilyRoutes = require("./routes/jobFamily");
const organizationRoutes = require("./routes/organization");
const imageRoutes = require("./routes/image");

require("./models/assocations");

const fileStorage = multer.diskStorage({
  destination: (req, _, cb) => {
    const { saveType } = req.query;
    if (saveType) cb(null, `uploads/${saveType}`);
    else cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    const imageExtension = file.originalname.split(".")[1];
    const timestamp = new Date().getMilliseconds();
    const randomString = Math.random().toString(36).substring(7);
    cb(null, `${timestamp}_${randomString}.${imageExtension}`);
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
app.use("/jobFamilies", jobFamilyRoutes);
app.use("/skills", skillRoutes);
app.use("/organizations", organizationRoutes);

app.use("/images", imageRoutes);

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
