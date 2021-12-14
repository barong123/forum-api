const PutLikeUseCase = require("../../../../Applications/use_case/PutLikeUseCase");

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const putLikeUseCase = this._container.getInstance(PutLikeUseCase.name);

    const { commentId, threadId } = request.params;
    const { id } = request.auth.credentials;

    await putLikeUseCase.execute({
      commentId,
      threadId,
      userId: id,
    });

    return {
      status: "success",
    };
  }
}

module.exports = LikesHandler;
