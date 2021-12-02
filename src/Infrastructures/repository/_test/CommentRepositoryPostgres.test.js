const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const AddedComment = require("../../../Domains/threads/entities/AddedComment");
const AddComment = require("../../../Domains/threads/entities/AddComment");
const CommentDetail = require("../../../Domains/threads/entities/CommentDetail");
const DeleteComment = require("../../../Domains/threads/entities/DeleteComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist added comment", async () => {
      // Arrange
      ThreadsTableTestHelper.addThread({ id: "thread-123" });
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
      ThreadsTableTestHelper.addThread({ id: "thread-123" });
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

  describe("getCommentDetail function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentDetail("comment-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return comment detail correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "myUser",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        content: "ini konten",
        isDeleted: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentDetail = await commentRepositoryPostgres.getCommentDetail(
        "comment-123"
      );

      // Assert
      expect(commentDetail).toStrictEqual(
        new CommentDetail({
          id: "comment-123",
          content: "**komentar telah dihapus**",
          date: "2021-08-08T07:22:33.555Z",
          username: "myUser",
          replies: [],
        })
      );
    });
  });

  describe("deleteComment function", () => {
    it("should throw NotFoundErrorError when comment not found", async () => {
      // Arrange
      const deleteComment = new DeleteComment({
        userId: "user-123",
        threadId: "thread-123",
        commentId: "comment-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment(deleteComment)
      ).rejects.toThrowError(NotFoundError);
    });

    it("should throw AuthorizationError when user is not the comment owner", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      const deleteComment = new DeleteComment({
        userId: "user-456",
        threadId: "thread-123",
        commentId: "comment-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment(deleteComment)
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should delete comment properly", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      const deleteComment = new DeleteComment({
        userId: "user-123",
        threadId: "thread-123",
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
});
