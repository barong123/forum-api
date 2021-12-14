const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ content, userId, commentId, threadId }) {
    await this._threadRepository.verifyThreadExistence(threadId);
    await this._commentRepository.verifyCommentExistence(commentId);

    const addReply = new AddReply({ content, userId, commentId });

    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
