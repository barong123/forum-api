const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ content, userId, threadId }) {
    await this._threadRepository.verifyThreadExistence(threadId);

    const addComment = new AddComment({ content, userId, threadId });

    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
