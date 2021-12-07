const ReplyDetail = require("../ReplyDetail");

describe("a ReplyDetail entities", () => {
  it("should throw error when payload did not contain needed property or empty", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "ini konten",
      date: "2021-08-08T07:19:09.775Z",
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrowError(
      "REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      content: "ini konten",
      date: "2021-08-08T07:19:09.775Z",
      username: "myUser",
      isDeleted: false,
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrowError(
      "REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create ReplyDetail object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "ini konten",
      date: "2021-08-08T07:19:09.775Z",
      username: "myUser",
      isDeleted: false,
    };

    // Action
    const { id, content, date, username } = new ReplyDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
