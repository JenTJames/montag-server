const { DataTypes } = require("sequelize");

const sequelize = require("../utils/database");

const Organization = sequelize.define("organization", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
  },
});

module.exports = Organization;
