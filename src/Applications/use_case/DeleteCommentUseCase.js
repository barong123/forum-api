const DeleteComment = require("../../Domains/threads/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyComment(deleteComment);
    await this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
