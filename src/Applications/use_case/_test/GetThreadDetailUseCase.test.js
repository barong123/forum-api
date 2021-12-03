const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../../Domains/threads/entities/CommentDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/threads/CommentRepository");
const ReplyRepository = require("../../../Domains/threads/ReplyRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the get thread detail action correctly when isDeleted is true", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };
    const expectedThreadDetail = new ThreadDetail({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [],
    });
    const expectedCommentDetail = new CommentDetail({
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      replies: [],
      isDeleted: true,
    });
    const expectedReplyDetail = new CommentDetail({
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      replies: [],
      isDeleted: true,
    });
    const expectedThreadDetailFull = new ThreadDetail({
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
            new CommentDetail({
              id: "reply-_pby2_tmXV6bcvcdev8xk",
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:22:33.555Z",
              username: "johndoe",
              replies: [],
              isDeleted: true,
            }),
          ],
          isDeleted: true,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetail));
    mockReplyRepository.getRepliesId = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve([expectedCommentDetail.id]))
      .mockImplementationOnce(() => Promise.resolve([expectedReplyDetail.id]));
    mockCommentRepository.getCommentDetail = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(expectedCommentDetail))
      .mockImplementationOnce(() => Promise.resolve(expectedReplyDetail));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetailFull);
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentDetail).toBeCalledWith(
      expectedCommentDetail.id
    );
  });

  it("should orchestrate the get thread detail action correctly when isDeleted is false", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };
    const expectedThreadDetail = new ThreadDetail({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [],
    });
    const expectedCommentDetail = new CommentDetail({
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      replies: [],
      isDeleted: false,
    });
    const expectedReplyDetail = new CommentDetail({
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      replies: [],
      isDeleted: false,
    });
    const expectedThreadDetailFull = new ThreadDetail({
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
            new CommentDetail({
              id: "reply-_pby2_tmXV6bcvcdev8xk",
              content: "sebuah reply",
              date: "2021-08-08T07:22:33.555Z",
              username: "johndoe",
              replies: [],
              isDeleted: false,
            }),
          ],
          isDeleted: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetail));
    mockReplyRepository.getRepliesId = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve([expectedCommentDetail.id]))
      .mockImplementationOnce(() => Promise.resolve([expectedReplyDetail.id]));
    mockCommentRepository.getCommentDetail = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(expectedCommentDetail))
      .mockImplementationOnce(() => Promise.resolve(expectedReplyDetail));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetailFull);
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentDetail).toBeCalledWith(
      expectedCommentDetail.id
    );
  });
});
