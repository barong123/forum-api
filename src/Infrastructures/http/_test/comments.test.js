const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("/comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      const requestPayload = {
        content: "abc",
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should response 404 if thread id is not found", async () => {
      // Arrange
      const requestPayload = { content: "abc" };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "thread yang dicari tidak ditemukan"
      );
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat komen baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        content: ["abc"],
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat komen baru karena tipe data tidak sesuai"
      );
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 if comment id is valid", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-789",
        username: "user789",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-789",
        owner: "user-789",
      });
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-789/comments/comment-123",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 404 when comment id is not found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-789" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-789",
        owner: "user-789",
      });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-789/comments/comment-123",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komen yang dicari tidak ditemukan");
    });
  });
});
