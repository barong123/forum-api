const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../../Domains/replies/entities/ReplyDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const RelationRepository = require("../../../Domains/relations/RelationRepository");
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
    const expectedReplyDetail = new ReplyDetail({
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
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
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockRelationRepository = new RelationRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetail));
    mockRelationRepository.getCommentsId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedCommentDetail.id]));
    mockRelationRepository.getRepliesId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedReplyDetail.id]));
    mockCommentRepository.getCommentDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCommentDetail));
    mockReplyRepository.getReplyDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReplyDetail));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      relationRepository: mockRelationRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetailFull);
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getCommentsId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getRepliesId).toBeCalledWith(
      expectedCommentDetail.id
    );
    expect(mockCommentRepository.getCommentDetail).toBeCalledWith(
      expectedCommentDetail.id
    );
    expect(mockReplyRepository.getReplyDetail).toBeCalledWith(
      expectedReplyDetail.id
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
    const expectedReplyDetail = new ReplyDetail({
      id: "reply-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah reply",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
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
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockRelationRepository = new RelationRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetail));
    mockRelationRepository.getCommentsId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedCommentDetail.id]));
    mockRelationRepository.getRepliesId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([expectedReplyDetail.id]));
    mockCommentRepository.getCommentDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCommentDetail));
    mockReplyRepository.getReplyDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReplyDetail));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      relationRepository: mockRelationRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetailFull);
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getCommentsId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockRelationRepository.getRepliesId).toBeCalledWith(
      expectedCommentDetail.id
    );
    expect(mockCommentRepository.getCommentDetail).toBeCalledWith(
      expectedCommentDetail.id
    );
    expect(mockReplyRepository.getReplyDetail).toBeCalledWith(
      expectedReplyDetail.id
    );
  });
});
