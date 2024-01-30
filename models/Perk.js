const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Perk = sequelize.define("perks", {
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

module.exports = Perk;
