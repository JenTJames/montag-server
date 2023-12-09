const User = require("./User");
const Role = require("./Role");
const Organization = require("./Organization");

User.belongsTo(Role);
User.belongsTo(Organization);

Organization.hasMany(User, {
  as: "recruiter",
});

Role.hasMany(User);

module.exports = {
  User,
  Role,
};
