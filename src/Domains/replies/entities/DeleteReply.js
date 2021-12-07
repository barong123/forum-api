class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, replyId } = payload;

    this.userId = userId;
    this.replyId = replyId;
  }

  _verifyPayload({ userId, commentId, replyId }) {
    if (!userId || !replyId) {
      throw new Error("DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof userId !== "string" || typeof replyId !== "string") {
      throw new Error("DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteReply;
