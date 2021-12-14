const PutLike = require("../../../Domains/likes/entities/PutLike");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const PutLikeUseCase = require("../PutLikeUseCase");

describe("PutLikeUseCase", () => {
  it("should orchestrate the add like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "abc",
      threadId: "thread-123",
      userId: "user-123",
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getPutLikeUseCase = new PutLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await getPutLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExistence).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentExistence).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.checkLikeExistence).toBeCalledWith(
      new PutLike({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      })
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(
      new PutLike({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      })
    );
  });

  it("should orchestrate the remove like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "abc",
      threadId: "thread-123",
      userId: "user-123",
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.removeLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getPutLikeUseCase = new PutLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await getPutLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExistence).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentExistence).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.checkLikeExistence).toBeCalledWith(
      new PutLike({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      })
    );
    expect(mockLikeRepository.removeLike).toBeCalledWith(
      new PutLike({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      })
    );
  });
});
