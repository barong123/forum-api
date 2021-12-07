const AddReply = require("../AddReply");

describe("an AddReply entities", () => {
  it("should throw error when payload did not contain needed property or empty", () => {
    // Arrange
    const payload = {
      content: "abc",
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: "abc",
      userId: 123,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddReply object correctly", () => {
    // Arrange
    const payload = {
      content: "abc",
      userId: "user-123",
    };

    // Action
    const { content, userId } = new AddReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
  });
});
