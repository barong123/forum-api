class ReplyRepository {
  async addReply(addReply) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getRepliesByCommentIds(commentIds) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReply(deleteReply) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyOwner(deleteReply) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;
