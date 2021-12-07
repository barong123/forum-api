const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, relationRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._relationRepository = relationRepository;
  }

  async execute({ content, userId, threadId }) {
    const addComment = new AddComment({ content, userId });

    await this._threadRepository.verifyThreadExistence(threadId);

    const addedComment = await this._commentRepository.addComment(addComment);
    const commentId = addedComment.id;

    await this._relationRepository.addRelation({ threadId, commentId });

    return addedComment;
  }
}

module.exports = AddCommentUseCase;
