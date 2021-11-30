const AddComment = require("../AddComment");

describe("an AddedComment entities", () => {
  it("should throw error when payload did not contain needed property or empty", () => {
    // Arrange
    const payload = {
      content: "abc",
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: "abc",
      userId: "user-123",
      threadId: 123,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedComment object correctly", () => {
    // Arrange
    const payload = {
      content: "abc",
      userId: "user-123",
      threadId: "thread-123",
    };

    // Action
    const { content, userId, threadId } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
  });
});
