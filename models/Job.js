const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Job = sequelize.define("jobs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  whyToJoin: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  employmentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experienceLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isJobVisaProvided: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  workingSchedule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresOn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  salaryFrequency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Monthly",
  },
  salary: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  isSalaryNegotiable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Job;
