const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist added comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      const addComment = new AddComment({
        content: "abc",
        userId: "user-123",
        threadId: "thread-123",
      });
      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      const addComment = new AddComment({
        content: "abc",
        userId: "user-123",
        threadId: "thread-123",
      });
      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "abc",
          owner: "user-123",
        })
      );
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return an array of comments correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "myUser",
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        "thread-123"
      );

      // Assert
      expect(comments).toStrictEqual([
        {
          id: "comment-123",
          content: "ini konten",
          date: "2021-08-08T07:22:33.555Z",
          owner: "user-123",
          username: "myUser",
          is_delete: false,
          thread_id: "thread-123",
        },
      ]);
    });
  });

  describe("deleteComment function", () => {
    it("should delete comment properly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });
      const deleteComment = new DeleteComment({
        userId: "user-123",
        commentId: "comment-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(deleteComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        deleteComment.commentId
      );
      expect(comments[0].is_delete).toStrictEqual(true);
    });
  });

  describe("verifyCommentExistence function", () => {
    it("should throw NotFoundErrorError when comment not found", async () => {
      // Arrange
      const commentId = "comment-123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExistence(commentId)
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentOwner", () => {
    it("should throw AuthorizationError when user is not the comment owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });
      const deleteComment = new DeleteComment({
        userId: "user-456",
        commentId: "comment-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(deleteComment)
      ).rejects.toThrowError(AuthorizationError);
    });
  });
});
