const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB || "montag",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "Root@12345",
  {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "localhost",
  }
);

module.exports = sequelize;
