require("dotenv").config();
const express = require("express");

const app = express();

app.listen(process.env.PORT || 3001, () => {
  console.log("App running on port " + process.env.PORT || 3001);
});
