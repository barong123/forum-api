const RelationsTableTestHelper = require("../../../../tests/RelationsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const pool = require("../../database/postgres/pool");
const RelationRepositoryPostgres = require("../RelationRepositoryPostgres");

describe("RelationRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await RelationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await RelationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addRelation function", () => {
    it("should persist added thread-comment relation", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        threadId: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        commentId: "comment-123",
        owner: "user-123",
      });
      const threadId = "thread-123";
      const commentId = "comment-123";
      const relationRepositoryPostgres = new RelationRepositoryPostgres(pool);

      // Action
      await relationRepositoryPostgres.addRelation({ threadId, commentId });

      // Assert
      const comments = await RelationsTableTestHelper.findCommentsByThreadId(
        "thread-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should persist added comment-reply relation", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await CommentsTableTestHelper.addComment({
        commentId: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        commentId: "reply-123",
        owner: "user-123",
      });
      const commentId = "comment-123";
      const replyId = "reply-123";
      const relationRepositoryPostgres = new RelationRepositoryPostgres(pool);

      // Action
      await relationRepositoryPostgres.addRelation({ commentId, replyId });

      // Assert
      const replies = await RelationsTableTestHelper.findRepliesByCommentId(
        "comment-123"
      );
      expect(replies).toHaveLength(1);
    });
  });

  describe("getCommentsId function", () => {
    it("should return an array of comments' id correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-456",
        owner: "user-123",
      });
      await RelationsTableTestHelper.addRelation({
        threadId: "thread-123",
        commentId: "comment-123",
      });
      await RelationsTableTestHelper.addRelation({
        threadId: "thread-123",
        commentId: "comment-456",
      });
      const relationRepositoryPostgres = new RelationRepositoryPostgres(pool);

      // Action
      const idArray = await relationRepositoryPostgres.getCommentsId(
        "thread-123"
      );

      // Assert
      expect(idArray).toStrictEqual(["comment-123", "comment-456"]);
    });
  });

  describe("getRepliesId function", () => {
    it("should return an array of replies' id correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-456",
        owner: "user-123",
      });
      await RelationsTableTestHelper.addRelation({
        commentId: "comment-123",
        replyId: "reply-123",
      });
      await RelationsTableTestHelper.addRelation({
        commentId: "comment-123",
        replyId: "reply-456",
      });
      const relationRepositoryPostgres = new RelationRepositoryPostgres(pool);

      // Action
      const idArray = await relationRepositoryPostgres.getRepliesId(
        "comment-123"
      );

      // Assert
      expect(idArray).toStrictEqual(["reply-123", "reply-456"]);
    });

    it("should return an empty array if no relation is found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await CommentsTableTestHelper.addComment({
        id: "comment-789",
        owner: "user-123",
      });
      await RelationsTableTestHelper.addRelation({
        commentId: "comment-789",
      });
      const relationRepositoryPostgres = new RelationRepositoryPostgres(pool);

      // Action
      const idArray = await relationRepositoryPostgres.getRepliesId(
        "comment-789"
      );

      // Assert
      expect(idArray).toStrictEqual([]);
    });
  });
});
