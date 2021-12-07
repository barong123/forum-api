const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrate the delete comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      userId: "user-123",
      commentId: "comment-123",
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyComment).toBeCalledWith(
      new DeleteComment({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      })
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      new DeleteComment({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      })
    );
  });
});
