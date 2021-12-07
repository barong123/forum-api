class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, replies, isDeleted } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
    this.isDeleted = isDeleted;
  }

  _verifyPayload({ id, content, date, username, replies, isDeleted = false }) {
    if (!id || !content || !date || !username || !replies) {
      throw new Error("COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof replies !== "object" ||
      typeof isDeleted !== "boolean"
    ) {
      throw new Error("COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentDetail;
