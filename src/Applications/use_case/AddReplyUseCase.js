const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    relationRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._relationRepository = relationRepository;
  }

  async execute({ content, userId, commentId, threadId }) {
    const addReply = new AddReply({ content, userId });

    await this._threadRepository.getThreadDetail(threadId);
    await this._commentRepository.getCommentDetail(commentId);

    const addedReply = await this._replyRepository.addReply(addReply);
    const replyId = addedReply.id;

    await this._relationRepository.addRelation({
      commentId,
      replyId,
    });

    return addedReply;
  }
}

module.exports = AddReplyUseCase;
