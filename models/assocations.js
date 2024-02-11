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
User.hasMany(Job, { as: "jobs", foreignKey: "postedBy" });

Organization.hasMany(User, {
  as: "recruiter",
});

Role.hasMany(User);

JobFamily.hasMany(Skill);
JobFamily.hasMany(Job);

Skill.belongsTo(JobFamily);
Skill.belongsToMany(Job, { through: "job_skills" });

Job.belongsTo(JobFamily);
Job.belongsTo(User, { as: "postedByUser", foreignKey: "postedBy" });
Job.belongsToMany(Perk, { through: "job_perks" });
Job.belongsToMany(Country, { as: "locations", through: "job_locations" });
Job.belongsToMany(Skill, { through: "job_skills" });

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
