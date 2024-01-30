const Job = require("./Job");
const User = require("./User");
const Role = require("./Role");
const Perk = require("./Perk");
const Skill = require("./Skill");
const Country = require("./Country");
const JobFamily = require("./JobFamily");
const Organization = require("./Organization");

User.belongsTo(Role);
User.belongsTo(Organization);

Organization.hasMany(User, {
  as: "recruiter",
});

Role.hasMany(User);

JobFamily.hasMany(Skill);
JobFamily.hasMany(Job);

Skill.belongsTo(JobFamily);

Job.belongsTo(JobFamily);
Job.belongsToMany(Perk, { through: "job_perks" });
Job.belongsToMany(Country, { as: "locations", through: "job_locations" });

Perk.belongsToMany(Job, { through: "job_perks" });

Country.belongsToMany(Job, { through: "job_locations" });

module.exports = {
  Job,
  User,
  Role,
  Perk,
  Skill,
  Country,
  JobFamily,
  Organization,
};
