const PutLike = require("../PutLike");

describe("a PutLike entities", () => {
  it("should throw error when payload did not contain needed property or empty", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
    };

    // Action and Assert
    expect(() => new PutLike(payload)).toThrowError(
      "PUT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
      userId: 123,
    };

    // Action and Assert
    expect(() => new PutLike(payload)).toThrowError(
      "PUT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create PutLike object correctly", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
      userId: "user-123",
    };

    // Action
    const { commentId, userId } = new PutLike(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  });
});
