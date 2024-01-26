const User = require("./User");
const Role = require("./Role");
const Organization = require("./Organization");
const JobFamily = require("./JobFamily");
const Skill = require("./Skill");

User.belongsTo(Role);
User.belongsTo(Organization);

Organization.hasMany(User, {
  as: "recruiter",
});

Role.hasMany(User);

JobFamily.hasMany(Skill);
Skill.belongsTo(JobFamily);

module.exports = {
  User,
  Role,
  Organization,
};
