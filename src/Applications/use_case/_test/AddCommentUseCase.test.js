const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../AddCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddCommentUseCase", () => {
  it("should orchestrate the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "abc",
      userId: "user-123",
      threadId: "thread-123",
    };
    const expectedAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));
    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getAddCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getAddCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadExistence).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: useCasePayload.content,
        userId: useCasePayload.userId,
        threadId: useCasePayload.threadId,
      })
    );
  });
});
