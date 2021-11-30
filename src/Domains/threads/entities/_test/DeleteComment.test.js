const DeleteComment = require("../DeleteComment");

describe("a DeleteComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      userId: "user-123",
      threadId: "thread-123",
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      userId: "user-123",
      threadId: "thread-123",
      commentId: 123,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DeleteComment object correctly", () => {
    // Arrange
    const payload = {
      userId: "user-123",
      threadId: "thread-123",
      commentId: "comment-123",
    };

    // Action
    const { userId, threadId, commentId } = new DeleteComment(payload);

    // Assert
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
  });
});
