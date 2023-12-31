const expect = require("chai").expect;
const sinon = require("sinon");

const Role = require("../models/Role");
const RoleController = require("../controllers/role");

describe("../controllers/role.js", () => {
  describe("findAllRoles()", () => {
    afterEach("Unstub all stubs", () => {
      sinon.restore();
    });

    it("should throw an error when the user create operation failes", async () => {
      sinon.stub(Role, "findAll").throws(new Error());

      await RoleController.findAllRoles({}, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should send a status of 204 when no roles are found", async () => {
      const res = {
        statusCode: 0,
        sendStatus: (code) => {
          res.statusCode = code;
          return res;
        },
      };

      sinon.stub(Role, "findAll").returns([]);

      await RoleController.findAllRoles({}, res, () => {});

      expect(res.statusCode).to.be.equal(204);
    });

    it("should send the fetched roles with status 200", async () => {
      const res = {
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

      sinon.stub(Role, "findAll").returns([{ id: 1 }, { id: 2 }]);

      await RoleController.findAllRoles({}, res, () => {});

      expect(res.statusCode).to.be.equal(200);
      expect(res.data.length).to.be.equal(2);
      expect(res.data).to.be.an.instanceOf(Array);
      expect(res.data[0].id).to.be.equal(1);
    });
  });

  describe("verifyRole()", () => {
    afterEach("Unstub all stubs", () => {
      sinon.restore();
    });

    it("should return an error if roleId is falsy", async () => {
      const isRoleValid = await RoleController.verifyRole(0);
      expect(isRoleValid).to.be.an.instanceOf(Error);
    });

    it("should return false if a role with the given id doesn't exist", async () => {
      sinon.stub(Role, "count").returns(0);

      const isRoleValid = await RoleController.verifyRole(1);

      expect(isRoleValid).to.be.false;
    });

    it("should return true if a role with the id exists", async () => {
      sinon.stub(Role, "count").returns(1);

      const isRoleValid = await RoleController.verifyRole(2);

      expect(isRoleValid).to.be.true;
    });

    it("should return an error if the count operation fails", async () => {
      sinon.stub(Role, "count").throws(new Error());

      const isRoleValid = await RoleController.verifyRole(1);

      expect(isRoleValid).to.be.an.instanceOf(Error);
    });
  });
});
