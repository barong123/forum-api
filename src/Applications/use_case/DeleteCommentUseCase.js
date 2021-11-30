const DeleteComment = require("../../Domains/threads/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._replyRepository.deleteReply(useCasePayload.commentId);
    await this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
