const expect = require("chai").expect;
const sinon = require("sinon");
const bcrypt = require("bcrypt");

const UserController = require("../controllers/user");
const roleController = require("../controllers/role");
const User = require("../models/User");

describe("../controllers/user.js", () => {
  afterEach("Restore Sinon stubs", () => {
    sinon.restore();
  });

  describe("createUser()", () => {
    it("should return 400 when mandatory user details are missing", async () => {
      const req = {
        body: {},
      };
      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.be.equal(400);
      });
    });

    it("should throw an error if password hashing fails", async () => {
      const req = {
        body: {
          firstname: "test",
          lastname: "test",
          phoneNumber: "8590492117",
          email: "test@test.com",
          password: "asecretpassword",
          role: {
            id: 1,
          },
        },
      };

      sinon.stub(bcrypt, "genSalt").resolves(12);
      sinon.stub(bcrypt, "hash").throws(new Error());
      sinon.stub(roleController, "verifyRole").returns(true);

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.be.equal(
          "Something went wrong while hashing the password"
        );
      });
    });

    it("should throw an error when user create operation fails", async () => {
      const req = {
        body: {
          firstname: "test",
          lastname: "test",
          phoneNumber: "8590492117",
          email: "test@test.com",
          password: "asecretpassword",
          role: {
            id: 1,
          },
        },
      };

      sinon.stub(bcrypt, "genSalt").resolves("ooooooo");
      sinon.stub(bcrypt, "hash").resolves("xxxxxxx");
      sinon.stub(roleController, "verifyRole").returns(true);
      sinon.stub(User, "create").throws(new Error());

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should return 400 when role verification returns an error", async () => {
      const req = {
        body: {
          firstname: "test",
          lastname: "test",
          phoneNumber: "8590492117",
          email: "test@test.com",
          password: "asecretpassword",
          role: {
            id: 1,
          },
        },
      };

      sinon.stub(bcrypt, "genSalt").returns("ooooooo");
      sinon.stub(bcrypt, "hash").returns("xxxxxxx");
      sinon.stub(roleController, "verifyRole").returns(new Error());

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.be.equal("Invalid Role");
        expect(error.code).to.equal(400);
      });
    });

    it("should return 400 when role verification returns false", async () => {
      const req = {
        body: {
          firstname: "test",
          lastname: "test",
          phoneNumber: "8590492117",
          email: "test@test.com",
          password: "asecretpassword",
          role: {
            id: 1,
          },
        },
      };

      sinon.stub(bcrypt, "genSalt").returns("ooooooo");
      sinon.stub(bcrypt, "hash").returns("xxxxxxx");
      sinon.stub(roleController, "verifyRole").returns(false);

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.be.equal("Invalid Role");
        expect(error.code).to.equal(400);
      });
    });

    it("should return 201 and ID if the create user operation succeeds", async () => {
      const req = {
        body: {
          firstname: "test",
          lastname: "test",
          phoneNumber: "1234567890",
          email: "test@test.com",
          password: "asecretpassword",
          role: {
            id: 1,
          },
        },
      };

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

      sinon.stub(bcrypt, "genSalt").returns("ooooooo");
      sinon.stub(bcrypt, "hash").returns("xxxxxxx");
      sinon.stub(roleController, "verifyRole").returns(true);
      sinon.stub(User, "create").returns({ id: 1 });

      await UserController.createUser(req, res, () => {});

      expect(res.statusCode).to.be.equal(201);
      expect(res.data).to.be.equal(1);
    });
  });
});
