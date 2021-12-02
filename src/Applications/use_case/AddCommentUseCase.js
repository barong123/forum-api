const AddComment = require("../../Domains/threads/entities/AddComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ content, userId, threadId, parentThreadId }) {
    const addComment = new AddComment({ content, userId, threadId });

    if (parentThreadId) {
      await this._threadRepository.getThreadDetail(parentThreadId);
    }

    const addedComment = await this._commentRepository.addComment(addComment);

    const threadOrCommentId = threadId;
    const replyId = addedComment.id;

    await this._replyRepository.addReply(threadOrCommentId, replyId);

    return addedComment;
  }
}

module.exports = AddCommentUseCase;
