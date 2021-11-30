const AddComment = require("../../Domains/threads/entities/AddComment");

class AddCommentUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    const addedComment = await this._commentRepository.addComment(addComment);

    const threadOrCommentId = useCasePayload.threadId;
    const replyId = addedComment.id;

    await this._replyRepository.addReply(threadOrCommentId, replyId);

    return addedComment;
  }
}

module.exports = AddCommentUseCase;
