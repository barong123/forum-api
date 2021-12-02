const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );

    const { content } = request.payload;
    const { id } = request.auth.credentials;
    const { commentId, threadId } = request.params;

    const addedReply = await addCommentUseCase.execute({
      content,
      userId: id,
      threadId: commentId,
      parentThreadId: threadId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    const { id } = request.auth.credentials;
    const { commentId, replyId } = request.params;

    await deleteCommentUseCase.execute({
      userId: id,
      threadId: commentId,
      commentId: replyId,
    });

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
