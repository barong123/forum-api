const AddComment = require("../../Domains/threads/entities/AddComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ content, userId, threadId, parentThreadId }) {
    const addComment = new AddComment({ content, userId, threadId });

    let isThreadReply;
    if (parentThreadId) {
      await this._threadRepository.getThreadDetail(parentThreadId);
      await this._commentRepository.getCommentDetail(threadId);
      isThreadReply = false;
    } else {
      await this._threadRepository.getThreadDetail(threadId);
      isThreadReply = true;
    }

    const addedComment = await this._commentRepository.addComment(
      addComment,
      isThreadReply
    );

    const threadOrCommentId = threadId;
    const replyId = addedComment.id;

    await this._replyRepository.addReply(threadOrCommentId, replyId);

    return addedComment;
  }
}

module.exports = AddCommentUseCase;
