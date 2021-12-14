class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, userId, commentId } = payload;

    this.content = content;
    this.userId = userId;
    this.commentId = commentId;
  }

  _verifyPayload({ content, userId, commentId }) {
    if (!content || !userId || !commentId) {
      throw new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof userId !== "string" ||
      typeof commentId !== "string"
    ) {
      throw new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddReply;
