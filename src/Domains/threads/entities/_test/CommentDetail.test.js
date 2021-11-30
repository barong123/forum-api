const CommentDetail = require("../CommentDetail");

describe("a CommentDetail entities", () => {
  it("should throw error when payload did not contain needed property or empty", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "ini konten",
      date: "2021-08-08T07:19:09.775Z",
      username: "myUser",
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      "COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "ini konten",
      date: "2021-08-08T07:19:09.775Z",
      username: "myUser",
      replies: "123",
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      "COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CommentDetail object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "ini konten",
      date: "2021-08-08T07:19:09.775Z",
      username: "myUser",
      replies: [],
    };

    // Action
    const { id, content, date, username, replies } = new CommentDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(replies).toEqual(payload.replies);
  });
});
