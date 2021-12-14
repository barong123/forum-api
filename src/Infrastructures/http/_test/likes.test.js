const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");

describe("/likes endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 200 and persisted like if like entry doesn't exist", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user456",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        owner: "user-456",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-456",
        owner: "user-456",
        threadId: "thread-456",
      });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-456/comments/comment-456/likes",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 200 and removed like if like entry exists", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user456",
      });
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user123",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        owner: "user-456",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-456",
        owner: "user-456",
        threadId: "thread-456",
      });
      await LikesTableTestHelper.addLike({
        commentid: "comment-456",
        userId: "user-123",
      });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-456/comments/comment-456/likes",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
