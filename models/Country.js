const { DataTypes } = require("sequelize");

const sequelize = require("../utils/database");

const Country = sequelize.define("countries", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Country;
