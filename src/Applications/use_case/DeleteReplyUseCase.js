const DeleteReply = require("../../Domains/replies/entities/DeleteReply");

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);

    await this._replyRepository.verifyReply(deleteReply);
    await this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
