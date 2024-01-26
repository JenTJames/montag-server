const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Skill = sequelize.define("skills", {
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

module.exports = Skill;
