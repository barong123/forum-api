const DeleteReply = require("../DeleteReply");

describe("a DeleteReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      userId: "user-123",
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      "DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      userId: "user-123",
      replyId: 123,
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      "DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DeleteReply object correctly", () => {
    // Arrange
    const payload = {
      userId: "user-123",
      replyId: "reply-123",
    };

    // Action
    const { userId, replyId } = new DeleteReply(payload);

    // Assert
    expect(userId).toEqual(payload.userId);
    expect(replyId).toEqual(payload.replyId);
  });
});
