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

  describe("getUser()", () => {
    let req;
    let res;
    beforeEach("Create req and res object", () => {
      req = {
        query: {
          email: "abc@mkl.com",
        },
      };
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

    it("should return status 400 if the email is not present", async () => {
      req.query.email = undefined;

      await UserController.getUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.be.equal(400);
      });
    });

    it("should return status 400 if the user returned is null", async () => {
      sinon.stub(UserController, "getUserByEmail").resolves(null);

      await UserController.getUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Could not find the user");
        expect(error.code).to.be.equal(400);
      });
    });

    it("should return status 400 if the user returned is an instance of Error", async () => {
      sinon.stub(UserController, "getUserByEmail").resolves(new Error());

      await UserController.getUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Could not find the user");
        expect(error.code).to.be.equal(400);
      });
    });

    it("should return status 200 and the user if the find operation is success", async () => {
      sinon.stub(UserController, "getUserByEmail").resolves({
        id: 1,
      });

      await UserController.getUser(req, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.be.an.instanceOf(Object);
      expect(res.data.id).to.equal(1);
    });
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

    it("should return an error with code 400 if the email is duplicate", async () => {
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(true);

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
        expect(error.message).to.equal(
          "Another user with the same email is already registered"
        );
      });
    });

    it("should return an error with code 400 if the email is invalid", async () => {
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(new Error());

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
        expect(error.message).to.equal("Invalid Email");
      });
    });

    it("should return an error with code 400 if the phone number is duplicate", async () => {
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(false);
      sinon.stub(UserController, "checkDuplicatePhoneNumber").returns(true);

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
        expect(error.message).to.equal(
          "Another user with the same phone number is already registered"
        );
      });
    });

    it("should return an error with code 400 if the phone number is invalid", async () => {
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(false);
      sinon
        .stub(UserController, "checkDuplicatePhoneNumber")
        .returns(new Error());

      await UserController.createUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
        expect(error.message).to.equal("Invalid Phone Number");
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(false);
      sinon.stub(UserController, "checkDuplicatePhoneNumber").returns(false);
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(false);
      sinon.stub(UserController, "checkDuplicatePhoneNumber").returns(false);
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(false);
      sinon.stub(UserController, "checkDuplicatePhoneNumber").returns(false);
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(false);
      sinon.stub(UserController, "checkDuplicatePhoneNumber").returns(false);
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

      sinon.stub(UserController, "checkDuplicateEmail").returns(false);
      sinon.stub(UserController, "checkDuplicatePhoneNumber").returns(false);
      sinon.stub(bcrypt, "genSalt").returns("ooooooo");
      sinon.stub(bcrypt, "hash").returns("xxxxxxx");
      sinon.stub(roleController, "verifyRole").returns(true);
      sinon.stub(User, "create").returns({ id: 1 });

      await UserController.createUser(req, res, () => {});

      expect(res.statusCode).to.be.equal(201);
      expect(res.data).to.be.equal("1");
    });
  });

  describe("updateUser()", () => {
    let req;
    let res;
    beforeEach("Create req and res object", () => {
      req = {
        body: {
          id: 1,
          firstname: "John",
          lastname: "Doe",
          phoneNumber: "1234567890",
          organizationId: 1,
        },
      };
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

    it("should return 400 if the user is not set", async () => {
      req.body = undefined;

      await UserController.updateUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
      });
    });

    it("should return 400 if the user id is not set", async () => {
      req.body.id = undefined;

      await UserController.updateUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
      });
    });

    it("should return 500 if the update operation fails", async () => {
      sinon.stub(User, "update").throws(new Error());

      await UserController.updateUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should throw an error if no user details where updated", async () => {
      sinon.stub(User, "update").resolves(0);

      await UserController.updateUser(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Could not edit the user");
      });
    });

    it("should return 200 if the user details are updated", async () => {
      sinon.stub(User, "update").resolves(1);

      await UserController.updateUser(req, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data.id).to.equal(1);
    });
  });

  describe("authenticate()", () => {
    let req;
    let res;
    beforeEach("Create req and res object", () => {
      req = {
        body: {
          identifier: "abc@mkl.com",
          password: "xxxxxx",
        },
      };
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

    it("should return status 400 if the request is missing required attributes", async () => {
      await UserController.authenticate({}, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
      });
    });

    it("should return status 401 if a user with the given email/phone number is not found", async () => {
      sinon.stub(User, "findOne").returns(null);

      await UserController.authenticate(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(401);
      });
    });

    it("should return status 401 if the password does not match for a given phone number", async () => {
      req.body.identifier = "12345";

      sinon.stub(User, "findOne").returns({
        password: "XXXX",
      });
      sinon.stub(bcrypt, "compare").returns(false);

      await UserController.authenticate(req, res, () => {});

      expect(res.statusCode).to.equal(401);
    });

    it("should return status 401 if the password does not match for a given email", async () => {
      sinon.stub(User, "findOne").returns({
        password: "XXXX",
      });
      sinon.stub(bcrypt, "compare").returns(false);

      await UserController.authenticate(req, res, () => {});

      expect(res.statusCode).to.equal(401);
    });

    it("should throw an error if user find operation fails", async () => {
      sinon.stub(User, "findOne").throws(new Error());

      await UserController.authenticate(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should return status 200 if the password matches for a given phone number", async () => {
      req.body.identifier = "12345";

      sinon.stub(User, "findOne").returns({
        id: 1,
        password: "XXXX",
      });
      sinon.stub(bcrypt, "compare").returns(true);

      await UserController.authenticate(req, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data.password).to.be.undefined;
      expect(res.data.id).to.equal(1);
    });

    it("should return status 200 if the password matches for a given email", async () => {
      sinon.stub(User, "findOne").returns({
        id: 1,
        password: "XXXX",
      });
      sinon.stub(bcrypt, "compare").returns(true);

      await UserController.authenticate(req, res, () => {});

      expect(res.statusCode).to.equal(200);
      expect(res.data.password).to.be.undefined;
      expect(res.data.id).to.equal(1);
    });
  });

  describe("getUserByEmail()", () => {
    it("should return code 400 if email is not provided", async () => {
      const response = await UserController.getUserByEmail();
      expect(response).to.be.an.instanceOf(Error);
      expect(response.code).to.equal(400);
      expect(response.message).to.equal("Invalid Email");
    });

    it("should return null if the user is not found", async () => {
      sinon.stub(User, "findOne").resolves(null);

      const response = await UserController.getUserByEmail("test@test.com");

      expect(response).to.be.null;
    });

    it("should return the error if the find operation fails", async () => {
      sinon.stub(User, "findOne").throws(new Error());

      const response = await UserController.getUserByEmail(
        "test@test.com",
        false
      );

      expect(response).to.be.an.instanceOf(Error);
    });

    it("should return the user without the password and organization if the user is found and organization query is not set", async () => {
      sinon.stub(User, "findOne").resolves({
        dataValues: {
          id: 1,
          password: "xxxx",
        },
      });

      const response = await UserController.getUserByEmail("test@test.com");
      expect(response).to.not.be.an.instanceOf(Error);
      expect(response.password).to.be.undefined;
      expect(response.organization).to.be.undefined;
    });

    it("should return the user with organization details if the user is found and organization query is true", async () => {
      // Stub the user.getOrganization() method
      const organizationStub = sinon.stub().resolves({ id: 1 });

      // Mock the User model and the method
      const userMock = {
        getOrganization: organizationStub,
        dataValues: {
          id: 1,
          password: "xxxx",
        },
      };

      // Replace the actual method with the stubbed method
      sinon.stub(User, "findOne").resolves(userMock);

      const response = await UserController.getUserByEmail(
        "test@test.com",
        true
      );

      expect(response).to.not.be.an.instanceOf(Error);
      expect(response.id).to.equal(1);
      expect(response.password).to.be.undefined;
      expect(response.organization.id).to.equal(1);
    });
  });

  describe("checkDuplicateEmail()", () => {
    it("should return an error with code 400 if the email is invalid", async () => {
      const isDuplicate = await UserController.checkDuplicateEmail();

      expect(isDuplicate).to.be.an.instanceOf(Error);
      expect(isDuplicate.code).to.equal(400);
    });

    it("should return true if a user with the email exists", async () => {
      sinon.stub(User, "count").returns(1);

      const isDuplicate = await UserController.checkDuplicateEmail("xyz");

      expect(isDuplicate).to.be.true;
    });

    it("should return false if a user with the email does not exist", async () => {
      sinon.stub(User, "count").returns(0);

      const isDuplicate = await UserController.checkDuplicateEmail("xyz");

      expect(isDuplicate).to.be.false;
    });

    it("should return the error if the count operation fails", async () => {
      sinon.stub(User, "count").throws(new Error());

      const isDuplicate = await UserController.checkDuplicateEmail("xyz");

      expect(isDuplicate).to.be.an.instanceOf(Error);
    });
  });

  describe("checkDuplicatePhoneNumber()", () => {
    it("should return an error with code 400 if the phone number is invalid", async () => {
      const isDuplicate = await UserController.checkDuplicatePhoneNumber();

      expect(isDuplicate).to.be.an.instanceOf(Error);
      expect(isDuplicate.code).to.equal(400);
    });

    it("should return true if a user with the phone number exists", async () => {
      sinon.stub(User, "count").returns(1);

      const isDuplicate = await UserController.checkDuplicatePhoneNumber("123");

      expect(isDuplicate).to.be.true;
    });

    it("should return false if a user with the phone number does not exist", async () => {
      sinon.stub(User, "count").returns(0);

      const isDuplicate = await UserController.checkDuplicatePhoneNumber("123");

      expect(isDuplicate).to.be.false;
    });

    it("should return the error if the count operation fails", async () => {
      sinon.stub(User, "count").throws(new Error());

      const isDuplicate = await UserController.checkDuplicatePhoneNumber("123");

      expect(isDuplicate).to.be.an.instanceOf(Error);
    });
  });

  describe("uploadUserImage()", () => {
    let req;
    let res;
    beforeEach("Create req and res object", () => {
      req = {
        query: {
          id: 1,
        },
        file: {
          filename: "thisisafile",
        },
      };
      res = {
        statusCode: 0,
        sendStatus: (code) => {
          res.statusCode = code;
          return res;
        },
      };
    });

    it("should return 204 if file is not set", async () => {
      req.file = undefined;

      await UserController.uploadUserImage(req, res, () => {});

      expect(res.statusCode).to.equal(204);
    });

    it("should return 400 if the user with the given id is not present", async () => {
      sinon.stub(User, "findByPk").resolves(null);

      await UserController.uploadUserImage(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal(400);
        expect(error.message).to.equal(
          "Could not locate the user with the given ID"
        );
      });
    });

    it("should throw an error if the find operation fails", async () => {
      sinon.stub(User, "findByPk").throws(new Error());

      await UserController.uploadUserImage(req, {}, (error) => {
        expect(error).to.be.an.instanceOf(Error);
      });
    });

    it("should return 200 if the image is successfully saved", async () => {
      sinon.stub(User, "findByPk").resolves({
        save: () => {},
      });

      await UserController.uploadUserImage(req, res, (error) => {
        console.log(error);
      });

      expect(res.statusCode).to.equal(200);
    });
  });
});
