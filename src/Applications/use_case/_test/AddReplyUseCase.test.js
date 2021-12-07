const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const RelationRepository = require("../../../Domains/relations/RelationRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("AddReplyUseCase", () => {
  it("should orchestrate the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "abc",
      userId: "user-123",
      threadId: "thread-123",
      commentId: "comment-123",
    };
    const expectedAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockRelationRepository = new RelationRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));
    mockRelationRepository.addRelation = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getAddReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      relationRepository: mockRelationRepository,
    });

    // Action
    const addedReply = await getAddReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.getThreadDetail).toBeCalled();
    expect(mockCommentRepository.getCommentDetail).toBeCalled();
    expect(mockRelationRepository.addRelation).toBeCalled();
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
        userId: useCasePayload.userId,
      })
    );
  });
});
