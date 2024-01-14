const expect = require("chai").expect;
const sinon = require("sinon");

const JobFamily = require("../models/JobFamily");
const JobFamilyController = require("../controllers/jobFamily");

describe("../controllers/jobFamily.js", () => {
  let res;

  describe("getJobFamilies()", () => {
    afterEach("Unstub all stubs", () => {
      sinon.restore();
    });

    beforeEach("Create req and res object", () => {
      res = {
        statusCode: 0,
        status: (code) => {
          res.statusCode = code;
          return res;
        },
        sendStatus: (code) => {
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

    it("should return status 500 if the findAll operation fails", async () => {
      sinon.stub(JobFamily, "findAll").throws(new Error());

      await JobFamilyController.getJobFamilies({}, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should return status 204 if no job families are found", async () => {
      sinon.stub(JobFamily, "findAll").resolves([]);

      await JobFamilyController.getJobFamilies({}, res, () => {});

      expect(res.statusCode).to.equal(204);
    });

    it("should return 200 and the jobFamilies if found", async () => {
      sinon.stub(JobFamily, "findAll").resolves([
        { id: 1, name: "xxxx" },
        { id: 2, name: "yyyy" },
      ]);

      await JobFamilyController.getJobFamilies({}, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data.length).to.equal(2);
      expect(res.data[0].id).to.equal(1);
      expect(res.data[1].id).to.equal(2);
    });
  });
});
