class ReplyDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, isDeleted } = payload;

    this.id = id;
    this.content = isDeleted ? "**balasan telah dihapus**" : content;
    this.date = date;
    this.username = username;
    this.isDeleted = isDeleted;
  }

  _verifyPayload({ id, content, date, username, isDeleted = false }) {
    if (!id || !content || !date || !username) {
      throw new Error("REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof isDeleted !== "boolean"
    ) {
      throw new Error("REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ReplyDetail;
