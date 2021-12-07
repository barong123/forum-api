const DeleteReply = require("../../Domains/replies/entities/DeleteReply");

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);

    // verifyReplyOwner juga mengecek ketersedian balasan di database agar menghemat jumlah query
    await this._replyRepository.verifyReplyOwner(deleteReply);
    await this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
