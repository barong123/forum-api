const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../../Domains/replies/entities/ReplyDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const RelationRepository = require("../../../Domains/relations/RelationRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const UserRepository = require("../../../Domains/users/UserRepository");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the get thread detail action correctly when isDeleted is true", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };
    const expectedThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      owner: "user-123",
    };
    const expectedComment = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.555Z",
      owner: "user-123",
      is_delete: true,
    };
    const expectedReply = {
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      owner: "user-123",
      is_delete: true,
    };
    const expectedThreadDetail = new ThreadDetail({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        new CommentDetail({
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          content: "**komentar telah dihapus**",
          date: "2021-08-08T07:22:33.555Z",
          username: "johndoe",
          replies: [
            new ReplyDetail({
              id: "reply-_pby2_tmXV6bcvcdev8xk",
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:22:33.555Z",
              username: "johndoe",
              isDeleted: true,
            }),
          ],
          isDeleted: true,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockRelationRepository = new RelationRepository();

    /** mocking needed function */
    mockUserRepository.getUsernameById = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve("dicoding"))
      .mockImplementation(() => Promise.resolve("johndoe"));
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockRelationRepository.getCommentsId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedComment.id]));
    mockRelationRepository.getRepliesId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedReply.id]));
    mockCommentRepository.getComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComment));
    mockReplyRepository.getReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      relationRepository: mockRelationRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(
      expectedThread.owner
    );
    expect(mockThreadRepository.getThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getCommentsId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getRepliesId).toBeCalledWith(
      expectedComment.id
    );
    expect(mockCommentRepository.getComment).toBeCalledWith(expectedComment.id);
    expect(mockReplyRepository.getReply).toBeCalledWith(expectedReply.id);
  });

  it("should orchestrate the get thread detail action correctly when isDeleted is false", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };
    const expectedThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      owner: "user-123",
    };
    const expectedComment = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.555Z",
      owner: "user-123",
      is_delete: false,
    };
    const expectedReply = {
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      owner: "user-123",
      is_delete: false,
    };
    const expectedThreadDetail = new ThreadDetail({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        new CommentDetail({
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          content: "sebuah comment",
          date: "2021-08-08T07:22:33.555Z",
          username: "johndoe",
          replies: [
            new ReplyDetail({
              id: "reply-_pby2_tmXV6bcvcdev8xk",
              content: "sebuah reply",
              date: "2021-08-08T07:22:33.555Z",
              username: "johndoe",
              isDeleted: false,
            }),
          ],
          isDeleted: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockRelationRepository = new RelationRepository();

    /** mocking needed function */
    mockUserRepository.getUsernameById = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve("dicoding"))
      .mockImplementation(() => Promise.resolve("johndoe"));
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockRelationRepository.getCommentsId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedComment.id]));
    mockRelationRepository.getRepliesId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedReply.id]));
    mockCommentRepository.getComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComment));
    mockReplyRepository.getReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      relationRepository: mockRelationRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(
      expectedThread.owner
    );
    expect(mockThreadRepository.getThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getCommentsId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getRepliesId).toBeCalledWith(
      expectedComment.id
    );
    expect(mockCommentRepository.getComment).toBeCalledWith(expectedComment.id);
    expect(mockReplyRepository.getReply).toBeCalledWith(expectedReply.id);
  });
});
