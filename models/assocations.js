const User = require("./User");
const Role = require("./Role");

User.belongsTo(Role);

Role.hasMany(User);

module.exports = {
  User,
  Role,
};
