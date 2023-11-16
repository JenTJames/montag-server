require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const errorHandler = require("./middlewares/error");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRoutes);

app.use(errorHandler);

sequelize
  .sync({
    // alter: true,
    // force: true
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
