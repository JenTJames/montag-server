const expect = require("chai").expect;
const sinon = require("sinon");

const Skill = require("../models/Skill");
const SkillController = require("../controllers/skill");

describe("../controllers/skill.js", () => {
  let res;

  beforeEach("Create res object", () => {
    res = {
      statusCode: 0,
      status: (code) => {
        res.statusCode = code;
        return res;
      },
      data: null,
      send: (data) => {
        res.data = data;
        return res;
      },
    };
  });

  describe("getSkills()", () => {
    afterEach("Unstub all stubs", () => {
      sinon.restore();
    });

    it("should return the skills with the given job family ID", async () => {
      sinon.stub(Skill, "findAll").returns([
        { id: 1, name: "Skill 1" },
        { id: 2, name: "Skill 2" },
      ]);

      await SkillController.getSkills(
        { query: { jobFamilyId: 1 } },
        res,
        () => {}
      );
      expect(res.statusCode).to.equal(200);
      expect(res.data.length).to.equal(2);
    });

    it("should return all the skills", async () => {
      sinon.stub(Skill, "findAll").returns([
        { id: 1, name: "Skill 1" },
        { id: 2, name: "Skill 2" },
      ]);

      await SkillController.getSkills({ query: {} }, res, () => {});
      expect(res.statusCode).to.equal(200);
      expect(res.data.length).to.equal(2);
    });

    it("should throw an error if the find operation fails", async () => {
      sinon.stub(Skill, "findAll").throws(new Error());

      await SkillController.getSkills({ query: {} }, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });
  });
});
