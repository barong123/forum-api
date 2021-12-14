const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const PutLike = require("../../../Domains/likes/entities/PutLike");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("likeRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addLike function", () => {
    it("should persist added like", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user123",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user456",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });
      const putLike = new PutLike({
        commentId: "comment-123",
        userId: "user-456",
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.addLike(putLike);

      // Assert
      const likes = await LikesTableTestHelper.findSpecificLike({
        commentId: "comment-123",
        userId: "user-456",
      });
      expect(likes).toHaveLength(1);
    });
  });

  describe("removeLike function", () => {
    it("should remove the like from the database", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user123",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user456",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });
      await LikesTableTestHelper.addLike({
        commentid: "comment-123",
        userId: "user-456",
      });
      const putLike = new PutLike({
        commentId: "comment-123",
        userId: "user-456",
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.removeLike(putLike);

      // Assert
      const likes = await LikesTableTestHelper.findSpecificLike({
        commentId: "comment-123",
        userId: "user-456",
      });
      expect(likes).toHaveLength(0);
    });
  });

  describe("checkLikeExistence function", () => {
    it("should return false when like entry is not found", async () => {
      // Arrange
      const putLike = new PutLike({
        commentId: "comment-123",
        userId: "user-456",
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action & Assert
      expect(
        await likeRepositoryPostgres.checkLikeExistence(putLike)
      ).toStrictEqual(false);
    });

    it("should return true when like entry is found", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user123",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user456",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });
      await LikesTableTestHelper.addLike({
        commentid: "comment-123",
        userId: "user-456",
      });
      const putLike = new PutLike({
        commentId: "comment-123",
        userId: "user-456",
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action & Assert
      expect(
        await likeRepositoryPostgres.checkLikeExistence(putLike)
      ).toStrictEqual(true);
    });
  });

  describe("getLikesByCommentIds function", () => {
    it("should show likes containing comment ids and user ids", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user123",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user456",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });
      await LikesTableTestHelper.addLike({
        commentid: "comment-123",
        userId: "user-123",
      });
      await LikesTableTestHelper.addLike({
        commentid: "comment-123",
        userId: "user-456",
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action & Assert
      expect(
        await likeRepositoryPostgres.getLikesByCommentIds(["comment-123"])
      ).toStrictEqual([
        { comment_id: "comment-123", user_id: "user-123" },
        { comment_id: "comment-123", user_id: "user-456" },
      ]);
    });
  });
});
