const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist added reply", async () => {
      // Arrange
      const threadOrCommentId = "thread-123";
      const replyId = "comment-123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      await replyRepositoryPostgres.addReply(threadOrCommentId, replyId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesByThreadId(
        "thread-123"
      );
      expect(replies).toHaveLength(1);
    });
  });

  describe("getRepliesId function", () => {
    it("should return an array of replies' id correctly", async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        threadOrCommentId: "thread-123",
        replyId: "comment-123",
      });
      await RepliesTableTestHelper.addReply({
        threadOrCommentId: "thread-123",
        replyId: "comment-456",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      const idArray = await replyRepositoryPostgres.getRepliesId("thread-123");

      // Assert
      expect(idArray).toStrictEqual(["comment-123", "comment-456"]);
    });
  });
});
