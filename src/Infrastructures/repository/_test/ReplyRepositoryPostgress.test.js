const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const ReplyDetail = require("../../../Domains/replies/entities/ReplyDetail");
const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist added reply", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const addReply = new AddReply({
        content: "abc",
        userId: "user-123",
      });
      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const addReply = new AddReply({
        content: "abc",
        userId: "user-123",
      });
      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "abc",
          owner: "user-123",
        })
      );
    });
  });

  describe("getReply function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.getReply("reply-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return reply detail correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "myUser",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
        content: "ini konten",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replyDetail = await replyRepositoryPostgres.getReply("reply-123");

      // Assert
      expect(replyDetail).toStrictEqual({
        id: "reply-123",
        content: "ini konten",
        date: "2021-08-08T07:22:33.555Z",
        owner: "user-123",
        is_delete: false,
      });
    });
  });

  describe("deleteReply function", () => {
    it("should delete reply properly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });
      const deleteReply = new DeleteReply({
        userId: "user-123",
        replyId: "reply-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply(deleteReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById(
        deleteReply.replyId
      );
      expect(replies[0].is_delete).toStrictEqual(true);
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw NotFoundErrorError when reply not found", async () => {
      // Arrange
      const deleteReply = new DeleteReply({
        userId: "user-123",
        replyId: "reply-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(deleteReply)
      ).rejects.toThrowError(NotFoundError);
    });

    it("should throw AuthorizationError when user is not the reply owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });
      const deleteReply = new DeleteReply({
        userId: "user-456",
        replyId: "reply-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(deleteReply)
      ).rejects.toThrowError(AuthorizationError);
    });
  });
});
