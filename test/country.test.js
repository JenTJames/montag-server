const expect = require("chai").expect;
const sinon = require("sinon");

const Country = require("../models/Country");
const CountryController = require("../controllers/country");

describe("../controllers/country.js", () => {
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

  describe("findCountries()", () => {
    it("should return 500 if the find operation fails", async () => {
      sinon.stub(Country, "findAll").throws(new Error());

      await CountryController.findCountries({}, res, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should return 200 and the list of countries if the countries are fetched", async () => {
      sinon.stub(Country, "findAll").returns([
        {
          id: 1,
          title: "Country1",
        },
        {
          id: 2,
          title: "Country2",
        },
      ]);

      await CountryController.findCountries({}, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data.length).to.equal(2);
    });
  });
});
