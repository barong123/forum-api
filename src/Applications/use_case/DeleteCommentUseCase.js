const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);

    // verifyCommemntOwner juga mengecek ketersedian komen di database agar menghemat jumlah query
    await this._commentRepository.verifyCommentOwner(deleteComment);
    await this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
