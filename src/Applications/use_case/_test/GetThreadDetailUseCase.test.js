const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../../Domains/replies/entities/ReplyDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the sorted get thread detail action correctly when isDeleted is true", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };
    const expectedThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };
    const expectedComment = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      is_delete: true,
      thread_id: "thread-123",
    };
    const expectedReply1 = {
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      is_delete: true,
      comment_id: "comment-_pby2_tmXV6bcvcdev8xk",
    };
    const expectedReply2 = {
      id: "reply-123",
      content: "sebuah reply",
      date: "2021-08-09T07:22:33.879Z",
      username: "johndoe",
      is_delete: true,
      comment_id: "comment-_pby2_tmXV6bcvcdev8xk",
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
          likeCount: 2,
          replies: [
            new ReplyDetail({
              id: "reply-_pby2_tmXV6bcvcdev8xk",
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:22:33.555Z",
              username: "johndoe",
              isDeleted: true,
            }),
            new ReplyDetail({
              id: "reply-123",
              content: "**balasan telah dihapus**",
              date: "2021-08-09T07:22:33.879Z",
              username: "johndoe",
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
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedComment]));
    mockReplyRepository.getRepliesByCommentIds = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([expectedReply1, expectedReply2])
      );
    mockLikeRepository.getLikesByCommentIds = jest.fn().mockImplementation(() =>
      Promise.resolve([
        { comment_id: "comment-_pby2_tmXV6bcvcdev8xk", user_id: "dummyId" },
        { comment_id: "comment-_pby2_tmXV6bcvcdev8xk", user_id: "dummyId" },
      ])
    );

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith([
      expectedComment.id,
    ]);
    expect(mockLikeRepository.getLikesByCommentIds).toBeCalledWith([
      expectedComment.id,
    ]);
  });

  it("should orchestrate the sorted get thread detail action correctly when isDeleted is false", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };
    const expectedThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };
    const expectedComment1 = {
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      is_delete: false,
      thread_id: "thread-123",
    };
    const expectedComment2 = {
      id: "comment-123",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.999Z",
      username: "johndoe",
      is_delete: false,
      thread_id: "thread-123",
    };
    const expectedReply = {
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      is_delete: false,
      comment_id: "comment-_pby2_tmXV6bcvcdev8xk",
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
          likeCount: 2,
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
        new CommentDetail({
          id: "comment-123",
          content: "sebuah comment",
          date: "2021-08-08T07:22:33.999Z",
          username: "johndoe",
          likeCount: 2,
          replies: [],
          isDeleted: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([expectedComment1, expectedComment2])
      );
    mockReplyRepository.getRepliesByCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedReply]));
    mockLikeRepository.getLikesByCommentIds = jest.fn().mockImplementation(() =>
      Promise.resolve([
        { comment_id: "comment-_pby2_tmXV6bcvcdev8xk", user_id: "dummyId" },
        { comment_id: "comment-_pby2_tmXV6bcvcdev8xk", user_id: "dummyId" },
        { comment_id: "comment-123", user_id: "dummyId" },
        { comment_id: "comment-123", user_id: "dummyId" },
      ])
    );

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith([
      expectedComment1.id,
      expectedComment2.id,
    ]);
    expect(mockLikeRepository.getLikesByCommentIds).toBeCalledWith([
      expectedComment1.id,
      expectedComment2.id,
    ]);
  });
});
