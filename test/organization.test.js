const expect = require("chai").expect;
const sinon = require("sinon");

const Organization = require("../models/Organization");
const OrganizationController = require("../controllers/organization");

describe("../controllers/organization.js", () => {
  let res, req;

  beforeEach("Initialize res object", () => {
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

  afterEach("Unstubs all sinon stubs", () => {
    sinon.restore();
  });

  describe("getOrganizations()", () => {
    afterEach("Unstub all stubs", () => {
      sinon.restore();
    });

    it("should throw an error when the organzation fetch operation failes", async () => {
      sinon.stub(Organization, "findAll").throws(new Error());

      await OrganizationController.getOrganizations({}, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should send the fetched roles with status 200", async () => {
      sinon.stub(Organization, "findAll").returns([{ id: 1 }, { id: 2 }]);

      await OrganizationController.getOrganizations({}, res, () => {});

      expect(res.statusCode).to.be.equal(200);
      expect(res.data.length).to.be.equal(2);
      expect(res.data).to.be.an.instanceOf(Array);
      expect(res.data[0].id).to.be.equal(1);
    });
  });

  describe("uploadHandler()", async () => {
    beforeEach("Initialize req object", () => {
      req = {
        query: {
          id: 1,
        },
        file: {
          filename: "text.jpg",
        },
      };
    });

    it("should return status 200 if the file is not set", async () => {
      req.file = null;

      await OrganizationController.uploadHandler(req, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.equal("No file received");
    });

    it("should throw an error if the user fetch opertaion throws an error", async () => {
      sinon.stub(Organization, "findByPk").resolves(new Error());

      await OrganizationController.uploadHandler(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should return 400 if the organization is not present with the given ID", async () => {
      sinon.stub(Organization, "findByPk").resolves(null);

      await OrganizationController.uploadHandler(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
        expect(error.message).to.equal(
          "Could not locate the organization with the given ID"
        );
      });
    });

    it("should return 200 if the image details are saved", async () => {
      sinon.stub(Organization, "findByPk").resolves({
        id: 1,
        save: () => {},
      });

      await OrganizationController.uploadHandler(req, res, () => {});
      expect(res.statusCode).to.equal(200);
    });
  });
});
