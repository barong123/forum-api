class RelationRepository {
  async addRelation({ threadId, CommentId, replyId }) {
    throw new Error("RELATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentsId(threadId) {
    throw new Error("RELATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getRepliesId(commentId) {
    throw new Error("RELATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = RelationRepository;
