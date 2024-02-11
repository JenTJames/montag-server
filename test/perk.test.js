const expect = require("chai").expect;
const sinon = require("sinon");

const Perk = require("../models/Perk");
const PerkController = require("../controllers/perk");

describe("../controllers/perk.js", () => {
  afterEach("Unstub all stubs", () => {
    sinon.restore();
  });

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

  describe("findPerks()", () => {
    it("should return 500 if the find operation fails", async () => {
      sinon.stub(Perk, "findAll").throws(new Error());

      await PerkController.findPerks({}, res, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should return 200 and the list of perks if the perks are fetched", async () => {
      sinon.stub(Perk, "findAll").returns([
        {
          id: 1,
          title: "Perk1",
        },
        {
          id: 2,
          title: "Perk2",
        },
      ]);

      await PerkController.findPerks({}, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data.length).to.equal(2);
    });
  });

  describe("findTruePerks", () => {
    it("should return an error if the promise is rejected", async () => {
      sinon.stub(Promise, "all").throws(new Error("Something went wrong"));

      const error = await PerkController.findTruePerks({});

      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal("Something went wrong");
    });
  });
});
