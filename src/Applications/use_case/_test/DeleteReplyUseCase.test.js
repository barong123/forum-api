const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should orchestrate the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      userId: "user-123",
      replyId: "reply-123",
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyReply).toBeCalledWith(
      new DeleteReply({
        userId: useCasePayload.userId,
        replyId: useCasePayload.replyId,
      })
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(
      new DeleteReply({
        userId: useCasePayload.userId,
        replyId: useCasePayload.replyId,
      })
    );
  });
});
