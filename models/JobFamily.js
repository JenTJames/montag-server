const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const JobFamily = sequelize.define("jobFamilies", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = JobFamily;
