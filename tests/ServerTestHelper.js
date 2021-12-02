/* istanbul ignore file */
const Jwt = require("@hapi/jwt");
const pool = require("../src/Infrastructures/database/postgres/pool");
const UsersTableTestHelper = require("./UsersTableTestHelper");

const ServerTestHelper = {
  async getAccessToken() {
    const users = await UsersTableTestHelper.findUsersById("user-123");
    if (users.length < 1) {
      const payload = {
        id: "user-123",
        username: "myUser",
        password: "myPassword",
        fullname: "My User",
      };
      await UsersTableTestHelper.addUser(payload);
    }
    return Jwt.token.generate(
      {
        id: "user-123",
        username: "myUser",
        password: "myPassword",
        fullname: "My User",
      },
      process.env.ACCESS_TOKEN_KEY
    );
  },
};

module.exports = ServerTestHelper;
